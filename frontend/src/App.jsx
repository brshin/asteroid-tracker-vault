import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
    const [asteroids, setAsteroids] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const { getToken, isLoaded, isSignedIn } = useAuth();

    useEffect(() => {

        if (!isLoaded || !isSignedIn) {
            return;
        }

        fetch(`${API_BASE_URL}/asteroids`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (asteroids):", data);
                setAsteroids(data);
            })
            .catch(err => console.error("Network error:", err));

        
        const fetchUserFavorites = async () => {
            const token = await getToken();
            fetch(`${API_BASE_URL}/asteroids/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
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
        }

        fetchUserFavorites();
        
    }, [isLoaded, isSignedIn, getToken]);

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
        <div className="min-h-screen bg-[#0f0f11] text-gray-100 font-sans">
            <nav className="flex items-center justify-between p-6 bg-[#1a1a1d] border-b border-gray-800 shadow-lg">
                <h1 className="text-2xl font-bold tracking-wider text-white">☄️ Asteroid Tracker</h1>

                <div className="auth-controls">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>

            <SignedOut>
                <div className="flex flex-col items-center justify-center mt-20 text-center">
                    <h2 className="text-4xl font-extrabold mb-4">Welcome to the Vault</h2>
                    <p className="text-gray-400 text-lg">Please sign in to view and manage your favorite space rocks.</p>
                </div>
            </SignedOut>

            <SignedIn>
                <main className="max-w-7xl mx-auto p-8">

                    <div className="mb-12">
                        <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 mb-6">Today's Asteroids</h2>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {asteroids.map((asteroid) => (

                                /* Card */
                                <div key={asteroid.name} className="bg-[#161619] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-2xl hover:border-gray-600">
                                    <img src="/asteroid.svg" alt="Asteroid" className="w-16 h-16 mb-4 opacity-90" />

                                    <h3 className="text-xl font-bold mb-2">{asteroid.name}</h3>

                                    <p className={`font-semibold mb-6 px-3 py-1 rounded-full text-sm ${asteroid.potentiallyHazardous ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                                    {asteroid.potentiallyHazardous ? "⚠️ Hazardous" : "✅ Safe"}
                                    </p>

                                    <button 
                                        onClick={() => handleSaveAsteroid(asteroid)}
                                        className="mt-auto w-full py-2 bg-[#2a2a35] hover:bg-blue-600 rounded-lg font-bold transition-colors"
                                    >
                                        Favorite
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 mb-6">My Favorite Asteroids</h2>
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
                    </div>
                </main>
            </SignedIn>

        </div>    

    )

}

export default App;