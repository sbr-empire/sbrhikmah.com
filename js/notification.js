/* ======================================
   SBR GLOBAL - Notification System
====================================== */

const SBRNotification = {

    show(title, message, type = "info") {

        const old = document.getElementById("sbr-notification");
        if (old) old.remove();

        const box = document.createElement("div");
        box.id = "sbr-notification";

        box.innerHTML = `
            <strong>${title}</strong><br>
            <span>${message}</span>
        `;

        box.style.position = "fixed";
        box.style.top = "20px";
        box.style.right = "20px";
        box.style.zIndex = "99999";
        box.style.padding = "15px 20px";
        box.style.borderRadius = "12px";
        box.style.color = "#fff";
        box.style.fontSize = "15px";
        box.style.boxShadow = "0 10px 25px rgba(0,0,0,.4)";
        box.style.transition = ".4s";

        switch(type){

            case "success":
                box.style.background="#28a745";
                break;

            case "error":
                box.style.background="#dc3545";
                break;

            case "warning":
                box.style.background="#ffc107";
                box.style.color="#000";
                break;

            default:
                box.style.background="#0d6efd";
        }

        document.body.appendChild(box);

        setTimeout(()=>{
            box.style.opacity="0";
            setTimeout(()=>{
                box.remove();
            },400);
        },4000);

    }

};

/* Demo */

document.addEventListener("DOMContentLoaded",()=>{

    SBRNotification.show(
        "Assalamu Alaikum 🌸",
        "Welcome to SBR Global Super App",
        "success"
    );

});
/* ===============================
   SBR GLOBAL NOTIFICATION SYSTEM
================================ */

class SBRNotificationStore {

    constructor() {
        this.notifications = [];
    }

    add(title, message, type = "info") {

        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            time: new Date().toLocaleString()
        };

        this.notifications.unshift(notification);

        localStorage.setItem(
            "sbr_notifications",
            JSON.stringify(this.notifications)
        );

        console.log("Notification Added:", notification);

        return notification;
    }

    load() {

        const data = localStorage.getItem("sbr_notifications");

        if (data) {
            this.notifications = JSON.parse(data);
        }

        return this.notifications;
    }

    clear() {

        this.notifications = [];

        localStorage.removeItem("sbr_notifications");

        console.log("Notifications Cleared");
    }

}

const NotificationSystem = new SBRNotificationStore();

NotificationSystem.load();
/* Default Welcome Notification */

if (NotificationSystem.notifications.length === 0) {

    NotificationSystem.add(
        "Welcome",
        "Welcome to SBR Global Super App",
        "success"
    );

}
/* ===============================
   SBR GLOBAL PROFILE MANAGER
================================ */

class SBRProfile {

    constructor() {

        this.profile = JSON.parse(
            localStorage.getItem("sbr_profile")
        ) || {};

    }

    save(data) {

        this.profile = {
            ...this.profile,
            ...data
        };

        localStorage.setItem(
            "sbr_profile",
            JSON.stringify(this.profile)
        );

        console.log("Profile Saved");

    }

    get() {

        return this.profile;

    }

    clear() {

        this.profile = {};

        localStorage.removeItem("sbr_profile");

    }

}

const ProfileManager = new SBRProfile();
/* ===============================
   SBR GLOBAL AI ENGINE
================================ */

class SBRAI {

    constructor() {

        this.name = "SBR AI";

        this.version = "1.0";

    }

    greet(user = "Guest") {

        return `Assalamu Alaikum ${user}`;

    }

    search(query) {

        console.log("AI Searching:", query);

        return {
            success: true,
            query: query,
            results: []
        };

    }

    suggest(keyword) {

        return [
            "Healthcare",
            "Government Services",
            "Marketplace",
            "Education",
            "Travel"
        ];

    }

}

const AIEngine = new SBRAI();

console.log(AIEngine.greet("SBR User"));
