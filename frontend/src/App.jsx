import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
    const [asteroids, setAsteroids] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const { getToken } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/asteroids`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (asteroids):", data);
                setAsteroids(data);
            })
            .catch(err => console.error("Network error:", err));
        
        fetch(`${API_BASE_URL}/asteroids/favorites`)
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch favorites");
                }
                return data;
            })
            .then(data => {
                console.log("Data from backend (favorites):", data);
                setFavorites(data);
            })
            .catch(err => {
                console.error("Network error:", err);
                alert(err.message);
            });
    }, []);

    const handleSaveAsteroid = async (asteroid) => {
        const token = await getToken();
        console.log(token);

        fetch(`${API_BASE_URL}/asteroids/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: asteroid.name,
                potentiallyHazardous: asteroid.potentiallyHazardous
            })
        })
        .then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            return data;
        })
        .then(data => console.log("Success! Server says: ", data))
        .then(() => setFavorites(prevFavorites => [...prevFavorites, asteroid]))
        .catch(err => {
            console.error("Failed to add:", err);
            alert(err.message);
        });
    };

    const handleRemoveAsteroid = async (asteroidName) => {
        const token = await getToken();

        fetch(`${API_BASE_URL}/asteroids/favorites/${asteroidName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to delete asteroid");
            }
            return data;
        })
        .then(data => {
            console.log("Success! Server says:", data.message);

            setFavorites(favorites => favorites.filter(ast => ast.name !== asteroidName));
        })
        .catch(err => {
            console.error("Error removing:", err.message);
            alert(err.message);
        });
            
    };

    const handleUpdateNote = async (asteroidName, newNote) => {
        const token = await getToken();

        fetch(`${API_BASE_URL}/asteroids/favorites/${asteroidName}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
            body: JSON.stringify({ note: newNote })
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Could not save your note");
            }
            return data;
        })
        .then(updatedAsteroid => {
            console.log("Database updated successfully:", updatedAsteroid);

            setFavorites(prevFavorites => 
                prevFavorites.map(ast => 
                    ast.name === asteroidName ? updatedAsteroid : ast
                )
            );
        })
        .catch(err => {
            console.error("Update failed:", err.message);
            alert(`Error saving note: ${err.message}`);
        });
    };

    return (
        <div className="app-container">
            <nav className="top-nav">
                <h1>Asteroid Tracker</h1>

                <div className="auth-controls">
                    <SignedOut>
                        <SignInButton mode="modal" />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>

            <main>
            <h1>Asteroid Dashboard</h1>

            <h2>Today's Asteroids</h2>

            {asteroids.map((asteroid) => (
                <div key={asteroid.name}>
                    <h2>{asteroid.name}</h2>
                    <p>Hazardous: {asteroid.potentiallyHazardous.toString()}</p>

                    <button onClick={() => handleSaveAsteroid(asteroid)}>
                        Favorite
                    </button>
                </div>
            ))}

            <h2>My Favorite Asteroids</h2>

            {favorites.map((asteroid) => (
                <div key={asteroid.name}>
                    <h2>{asteroid.name}</h2>
                    <p>Hazardous: {asteroid.potentiallyHazardous.toString()}</p>

                    <p>Note: {asteroid.note || "No notes added yet."}</p>

                    <button onClick={() => {
                        const userNote = prompt("Enter a custom note for this asteroid:", asteroid.note || "");
                        if (userNote !== null) {
                            handleUpdateNote(asteroid.name, userNote);
                        }
                    }}>
                        Edit Note
                    </button>
                    
                    <button onClick={() => handleRemoveAsteroid(asteroid.name)}>
                        Unfavorite
                    </button>
                </div>
            ))}
            </main>
        </div>    

    )

}

export default App;