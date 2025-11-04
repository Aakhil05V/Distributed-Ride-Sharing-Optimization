// Distributed Ride-Sharing Optimization Platform

class RideShareOptimizer {
    constructor() {
        this.riders = [];
        this.drivers = [];
        this.activeMatches = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Rider section event listeners
        const requestRideBtn = document.getElementById('request-ride');
        if (requestRideBtn) {
            requestRideBtn.addEventListener('click', () => this.requestRide());
        }

        // Driver section event listeners
        const goOnlineBtn = document.getElementById('go-online');
        const goOfflineBtn = document.getElementById('go-offline');
        if (goOnlineBtn) {
            goOnlineBtn.addEventListener('click', () => this.driverOnline());
        }
        if (goOfflineBtn) {
            goOfflineBtn.addEventListener('click', () => this.driverOffline());
        }
    }

    // Rider methods
    requestRide() {
        const location = document.getElementById('rider-location').value;
        const destination = document.getElementById('rider-destination').value;

        if (!location || !destination) {
            alert('Please enter both location and destination');
            return;
        }

        const rider = {
            id: Math.random().toString(36).substr(2, 9),
            location: location,
            destination: destination,
            status: 'waiting',
            timestamp: new Date()
        };

        this.riders.push(rider);
        console.log('Ride requested:', rider);
        this.findOptimalMatch(rider);
        this.displayResults();
    }

    // Driver methods
    driverOnline() {
        const location = document.getElementById('driver-location').value;

        if (!location) {
            alert('Please enter your location');
            return;
        }

        const driver = {
            id: Math.random().toString(36).substr(2, 9),
            location: location,
            status: 'online',
            timestamp: new Date()
        };

        this.drivers.push(driver);
        console.log('Driver online:', driver);
        this.findOptimalMatch(driver);
        this.displayResults();
    }

    driverOffline() {
        alert('Driver is now offline');
        this.drivers = [];
        this.displayResults();
    }

    // Optimization algorithm
    findOptimalMatch(user) {
        // Haversine distance calculation
        const calculateDistance = (loc1, loc2) => {
            // Simplified distance calculation
            // In production, use actual GPS coordinates
            return Math.abs(loc1.charCodeAt(0) - loc2.charCodeAt(0)) / 100;
        };

        if (user.hasOwnProperty('destination')) {
            // This is a rider
            const matches = this.drivers.map(driver => ({
                driver: driver,
                distance: calculateDistance(user.location, driver.location),
                eta: Math.floor(Math.random() * 15) + 5
            }));

            if (matches.length > 0) {
                matches.sort((a, b) => a.distance - b.distance);
                const bestMatch = matches[0];
                this.activeMatches.push({
                    rider: user,
                    driver: bestMatch.driver,
                    distance: bestMatch.distance,
                    eta: bestMatch.eta
                });
            }
        }
    }

    // Display results
    displayResults() {
        const container = document.getElementById('matches-container');
        if (!container) return;

        if (this.activeMatches.length === 0) {
            container.innerHTML = '<p>No active matches yet.</p>';
            return;
        }

        const html = this.activeMatches.map(match => `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <h3>Match Found!</h3>
                <p><strong>Rider:</strong> ${match.rider.location} → ${match.rider.destination}</p>
                <p><strong>Driver:</strong> ${match.driver.location}</p>
                <p><strong>Distance:</strong> ${match.distance.toFixed(2)} km</p>
                <p><strong>ETA:</strong> ${match.eta} minutes</p>
            </div>
        `).join('');

        container.innerHTML = html;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RideShareOptimizer();
    console.log('Ride-Sharing Optimizer initialized');
});
