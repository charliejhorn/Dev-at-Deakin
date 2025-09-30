require("dotenv").config();
const { initFirebase } = require("../src/lib/firebase");

// sample deterministic data used for seeding (no faker)
const db = initFirebase();
if (!db) {
    // eslint-disable-next-line no-console
    console.error("firestore not configured. check .env");
    process.exit(1);
}

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

async function seed() {
    // eslint-disable-next-line no-console
    console.log("seeding database...");

    const batch = db.batch();

    // sample mechanics (names only)
    const sampleMechanics = ["Alex Morgan", "Jamie Lee", "Sam Patel"];

    // sample customers (names only)
    const sampleCustomers = [
        "Taylor Brooks",
        "Morgan Smith",
        "Jordan Casey",
        "Riley Chen",
        "Casey Nguyen",
        "Avery Johnson",
    ];

    // create jobs (hard-coded samples with embedded customer/mechanic data)
    const jobs = [];
    const sampleJobs = [
        { title: "Basic tune-up", status: "queued", durationHours: 1.5 },
        {
            title: "Brake adjustment & bleed",
            status: "in_progress",
            durationHours: 2,
        },
        { title: "Wheel truing", status: "waiting_parts", durationHours: 1 },
        {
            title: "Gear indexing and setup",
            status: "queued",
            durationHours: 1.5,
        },
        {
            title: "Tubeless tyre install",
            status: "completed",
            durationHours: 1,
        },
        {
            title: "Suspension service (fork)",
            status: "completed",
            durationHours: 2.5,
        },
        {
            title: "E-bike battery diagnostic",
            status: "in_progress",
            durationHours: 2,
        },
        {
            title: "Frame inspection & alignment",
            status: "queued",
            durationHours: 1,
        },
        {
            title: "Full service (comprehensive)",
            status: "queued",
            durationHours: 4,
        },
        {
            title: "Wheelset replacement & setup",
            status: "waiting_parts",
            durationHours: 2,
        },
    ];

    for (let i = 0; i < sampleJobs.length; i++) {
        const ref = db.collection("jobs").doc();
        jobs.push({ id: ref.id });
        const start = now + i * oneDay; // schedule jobs on subsequent days
        const sj = sampleJobs[i];
        const customerName = sampleCustomers[i % sampleCustomers.length];
        const mechanicName = sampleMechanics[i % sampleMechanics.length];
        batch.set(ref, {
            title: sj.title,
            customer: customerName,
            mechanic: mechanicName,
            status: sj.status,
            start: start,
            end: start + Math.floor(sj.durationHours * 60 * 60 * 1000),
            notes: `${sj.title} for customer ${customerName}`,
            createdAt: now,
            updatedAt: now,
        });
    }
    // eslint-disable-next-line no-console
    console.log(`- creating ${jobs.length} jobs...`);

    await batch.commit();
    // eslint-disable-next-line no-console
    console.log("database seeded successfully!");
}

seed().catch((e) => {
    // eslint-disable-next-line no-console
    console.error("seeding failed:", e);
    process.exit(1);
});
