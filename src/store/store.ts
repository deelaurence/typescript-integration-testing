// store.ts

class Store {
    // Example variables
    private dataStore: { [key: string]: any } = {};
    public config: { [key: string]: any } = {};

    // Example utility functions

    // Function to set a value in the data store
    set(key: string, value: any): void {
        this.dataStore[key] = value;
    }

    // Function to get a value from the data store
    get(key: string): any {
        return this.dataStore[key];
    }

    // Function to check if a key exists in the data store
    has(key: string): boolean {
        return this.dataStore.hasOwnProperty(key);
    }

    // Function to delete a value from the data store
    delete(key: string): void {
        delete this.dataStore[key]; 
    }

    // Example configuration function
    setConfig(key: string, value: any): void {
        this.config[key] = value;
    }

    // Function to get a configuration value
    getConfig(key: string): any {
        return this.config[key];
    }
}

// Export a single instance of the Store class
const storeInstance = new Store();
export default storeInstance;





// // userRoutes.ts

// import express from 'express';
// import store from './store';

// const router = express.Router();

// // Set a configuration value
// store.setConfig('appName', 'My Express App');

// // Route to get a configuration value
// router.get('/config', (req, res) => {
//     const appName = store.getConfig('appName');
//     res.send(`App Name: ${appName}`);
// });

// // Route to store and retrieve data
// router.post('/data', (req, res) => {
//     const { key, value } = req.body;
//     store.set(key, value);
//     res.send(`Stored ${key}: ${value}`);
// });

// router.get('/data/:key', (req, res) => {
//     const key = req.params.key;
//     const value = store.get(key);
//     res.send(`Retrieved ${key}: ${value}`);
// });

// export default router;
