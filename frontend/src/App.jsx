import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
    const [asteroids, setAsteroids] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/asteroids`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (asteroids):", data);
                setAsteroids(data);
            })
            .catch(err => console.error("Network error:", err));
        
        fetch(`${API_BASE_URL}/asteroids/favorites`)
            .then(res => res.json())
            .then(data => {
                console.log("Data from backend (favorites):", data);
                setFavorites(data);
            })
            .catch(err => console.error("Network error:", err));
    }, []);

    const handleSaveAsteroid = (asteroid) => {
        fetch(`${API_BASE_URL}/asteroids/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: asteroid.name,
                potentiallyHazardous: asteroid.potentiallyHazardous
            })
        })
        .then(res => res.json())
        .then(data => console.log("Success! Server says: ", data))
        .then(setFavorites(prevFavorites => [...prevFavorites, asteroid]))
        .catch(err => console.error("Failed to add:", err));
    };

    const handleRemoveAsteroid = (asteroidName) => {
        fetch(`${API_BASE_URL}/asteroids/favorites/${asteroidName}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message);

            setFavorites(favorites => favorites.filter(ast => ast.name !== asteroidName));
        })
        .catch(err => console.error("Error removing:", err));
    };

    return (
        <div>
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
                    <button onClick={() => handleRemoveAsteroid(asteroid.name)}>
                        Remove
                    </button>
                </div>
            ))}

        </div>
    )

}

export default App;