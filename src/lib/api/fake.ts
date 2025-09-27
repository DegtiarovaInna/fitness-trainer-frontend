// src/lib/api/fake.ts
type Req = { path: string; options: RequestInit };

let _bookingId = 1000;


let studios = [
  { id: 1, name: "City Gym", address: "Berlin, Hauptstr. 1" },
  { id: 2, name: "Fit House", address: "Kyiv, Khreshchatyk 10" },
];

let _studioId = 2;

let slots = [
  {
    id: 11, studioId: 1, date: new Date().toISOString().slice(0,10),
    startTime: { hour: 10, minute: 0 }, endTime: { hour: 11, minute: 0 },
    priceCents: 4000, trial: false
  },
  {
    id: 12, studioId: 1, date: new Date(Date.now()+86400000).toISOString().slice(0,10),
    startTime: { hour: 12, minute: 30 }, endTime: { hour: 13, minute: 30 },
    priceCents: 4500, trial: true
  },
];


let currentUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  phoneNumber: "+380 00 000 00 00"
};


function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export async function fakeApi<T>({ path, options }: Req): Promise<T> {
  await wait(200);
  const method = (options.method || "GET").toUpperCase();

  // ---------- AUTH ----------
  if (path.startsWith("/auth/refresh") && method === "POST") {
    return { accessToken: "fake-token" } as T;
  }
  if (path === "/api/auth/login" && method === "POST") {
    return { accessToken: "fake-token" } as T;
  }
  if (path === "/api/auth/register" && method === "POST") {
    return { id: 123, ...currentUser } as T;
  }

  // ---------- USERS (me) ----------
  if (path === "/api/users/me" && method === "GET") {
    return currentUser as T;
  }
  if (path === "/api/users/me" && method === "PUT") {
    const body = JSON.parse(options.body as string);
    currentUser = { ...currentUser, ...body };
    return currentUser as T;
  }
  if (path === "/api/users/me/password" && method === "PUT") {
    return { ok: true } as T;
  }

  // ---------- STUDIOS ----------
  if (path === "/api/studios" && method === "GET") {
    return studios as T;
  }
  if (path === "/api/studios" && method === "POST") {
    const body = JSON.parse(options.body as string);
    const item = { id: ++_studioId, name: body.name, address: body.address };
    studios = [...studios, item];
    return item as T;
  }
  if (path.match(/^\/api\/studios\/\d+$/) && method === "GET") {
    const id = Number(path.split("/").pop());
    return (studios.find(s => s.id === id) || null) as T;
  }
  if (path.match(/^\/api\/studios\/\d+$/) && method === "PUT") {
    const id = Number(path.split("/").pop());
    const body = JSON.parse(options.body as string);
    studios = studios.map(s => s.id === id ? { ...s, ...body } : s);
    return (studios.find(s => s.id === id) as any) as T;
  }
  if (path.match(/^\/api\/studios\/\d+$/) && method === "DELETE") {
    const id = Number(path.split("/").pop());
    studios = studios.filter(s => s.id !== id);
    return undefined as T;
  }

  // ---------- TIMESLOTS ----------
  if (path.match(/^\/api\/timeslots\/studio\/\d+\/available/)) {
    const studioId = Number(path.split("/")[4]);
    return slots.filter(s => s.studioId === studioId) as T;
  }
  if (path.match(/^\/api\/timeslots\/\d+$/) && method === "GET") {
    const id = Number(path.split("/").pop());
    return (slots.find(s => s.id === id) || null) as T;
  }

  // ---------- BOOKINGS ----------
  if (path === "/api/bookings" && method === "GET") {
    return [
      { id: 501, userId: 1, timeSlotId: 11, status: "CONFIRMED", createdAt: new Date().toISOString() },
      { id: 502, userId: 2, timeSlotId: 12, status: "PENDING", createdAt: new Date().toISOString() }
    ] as T;
  }
  if (path === "/api/bookings/me/upcoming" && method === "GET") {
    return [{ id: 601, userId: 1, timeSlotId: 11, status: "CONFIRMED", createdAt: new Date().toISOString() }] as T;
  }
  if (path === "/api/bookings/me/history" && method === "GET") {
    return [{ id: 401, userId: 1, timeSlotId: 12, status: "CANCELLED", createdAt: new Date().toISOString() }] as T;
  }
  if (path.match(/^\/api\/bookings\/\d+$/) && method === "GET") {
    const id = Number(path.split("/").pop());
    return { id, userId: 1, timeSlotId: 11, status: "CONFIRMED", createdAt: new Date().toISOString() } as T;
  }
  if (path === "/api/bookings/me" && method === "POST") {
    _bookingId += 1;
    return { id: _bookingId, userId: 1, timeSlotId: 11, status: "PENDING", createdAt: new Date().toISOString() } as T;
  }
  if (path.match(/^\/api\/bookings\/\d+\/cancel$/) && method === "PUT") {
    const id = Number(path.split("/")[3]);
    return { id, userId: 1, timeSlotId: 11, status: "CANCELLED", createdAt: new Date().toISOString() } as T;
  }

  // ---------- PAYMENTS ----------
  if (path === "/api/payments" && method === "POST") {
    return { id: 9001, clientSecret: "pi_client_secret_fake" } as T;
  }
  if (path.startsWith("/api/payments") && method === "GET") {
    return { content: [{ id: 9001, status: "SUCCEEDED", amountCents: 4000, createdAt: new Date().toISOString() }] } as T;
  }

  throw new Error(`fakeApi: no handler for ${method} ${path}`);
}
