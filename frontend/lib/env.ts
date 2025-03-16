let BACKEND_URL = "https://huzzicide.greenapp.live/api"
if (process.env.NODE_ENV === "development") {
    BACKEND_URL = "http://localhost:3007";
}

export { BACKEND_URL };