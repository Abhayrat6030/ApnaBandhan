
'use server';

// This file is temporarily unused to prevent server configuration errors.
// The tools that depend on firebase-admin have been disabled.

export async function listNewUsers({ count = 5 }: { count?: number } = {}) {
    console.log(`listNewUsers tool called but is disabled.`);
    return [];
}

export async function listRecentOrders({ count = 5 }: { count?: number } = {}) {
    console.log(`listRecentOrders tool called but is disabled.`);
    return [];
}

export async function getAppStatus() {
    console.log("getAppStatus tool called but is disabled");
    return {};
}

// The createCoupon function has been removed to resolve the build error.
