/*
    sqlite3 database functionality should be established after 
    storage into RAM is done as well as functionality for other sites.
*/

import sqlite3 from 'sqlite3';
import {JobListing} from "./JobListing.js";

const dbName = 'listings.db';

async function getDb() {
    try {
        // Automatically connects to existing, otherwise, creates new one
        const db = new sqlite3.Database(dbName);

        // Check if the table exists. Create it if it doesn't.
        db.exec(`
                CREATE TABLE IF NOT EXISTS job_listings (
                    id INTEGER PRIMARY KEY,
                    job_id TEXT UNIQUE NOT NULL,  
                    title TEXT NOT NULL,
                    location TEXT,
                    url TEXT NOT NULL,
                    date_found TEXT NOT NULL
                ); 
            `);
        return db;
    } catch (err) {
        console.error('Error opening or creating database:', err);
        throw err; // Re-throw the error for handling elsewhere
    }
}

async function addJobListing(listing: JobListing) {
    const db = await getDb();
    const stmt = db.prepare('INSERT INTO job_listings (job_id, title, location, url, date_found) VALUES (?, ?, ?, ?, ?)');
    stmt.run(listing.id, listing.jobTitle, listing.jobLocation, listing.jobUrl, listing.foundDate, (err: any) => {
        if (err) {
            console.error("Error inserting job listing:", err);
        }
        stmt.finalize();
        db.close();
    });
    return listing.id
}

async function addItem(name: string, value: string) {
    const db = await getDb();
    const result = db.run('INSERT INTO job_listings (name, value) VALUES (?, ?)', [name, value]);
    db.close();
    return result; // Return the result of the insertion (e.g., lastID)
}

async function getItem(id: number) {
    const db = await getDb();
    const row = db.get('SELECT * FROM job_listings WHERE id = ?', [id]);
    db.close();
    return row;
}

async function updateItem(id: number, name: string, value: string) {
    const db = await getDb();
    const result = db.run('UPDATE job_listings SET name = ?, value = ? WHERE id = ?', [name, value, id]);
    db.close();
    return result;
}

async function deleteItem(id: number) {
    const db = await getDb();
    const result = db.run('DELETE FROM job_listings WHERE id = ?', [id]);
    db.close();
    return result;
}

// Example usage
async function main() {
    try {
        await createItem("Test Name", "Test Value");
        const item = await getItem(1);
        console.log(item);
        await updateItem(1, "Updated Name", "Updated Value");
        const updatedItem = await getItem(1);
        console.log(updatedItem);
        await deleteItem(1);
        const deletedItem = await getItem(1);
        console.log(deletedItem); // should be undefined since it was deleted

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
