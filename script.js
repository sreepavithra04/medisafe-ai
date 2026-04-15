let medicines = JSON.parse(localStorage.getItem("meds")) || [];

function saveData() {
    localStorage.setItem("meds", JSON.stringify(medicines));
}

function renderList() {
    let list = document.getElementById("medicineList");
    list.innerHTML = "";

    medicines.forEach((m, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${m.name} ⏰ ${m.time}
        <button onclick="deleteMed(${index})">❌</button>`;
        list.appendChild(li);
    });
}

function addMedicine() {
    let name = document.getElementById("medicineInput").value;
    let time = document.getElementById("timeInput").value;

    if (name && time) {
        medicines.push({ name, time });
        saveData();
        renderList();
        scheduleReminder(name, time);
    }
}

function deleteMed(index) {
    medicines.splice(index, 1);
    saveData();
    renderList();
}

function checkInteractions() {
    let resultText = "✅ Safe Combination";
    let className = "safe";

    for (let i = 0; i < medicines.length; i++) {
        for (let j = i + 1; j < medicines.length; j++) {

            let m1 = medicines[i].name.toLowerCase();
            let m2 = medicines[j].name.toLowerCase();

            if ((m1 === "aspirin" && m2 === "warfarin") ||
                (m1 === "warfarin" && m2 === "aspirin")) {
                resultText = "⚠️ HIGH RISK: Aspirin + Warfarin";
                className = "high";
            }

            else if ((m1 === "paracetamol" && m2 === "ibuprofen")) {
                resultText = "🟡 MEDIUM RISK";
                className = "medium";
            }
        }
    }

    let result = document.getElementById("result");
    result.textContent = resultText;
    result.className = className;
}

function scheduleReminder(name, time) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    let now = new Date();
    let [h, m] = time.split(":");

    let reminder = new Date();
    reminder.setHours(h, m, 0);

    let delay = reminder - now;

    if (delay > 0) {
        setTimeout(() => {
            new Notification("💊 Take " + name);
        }, delay);
    }
}

// 🤖 SIMPLE AI CHAT
function askAI() {
    let input = document.getElementById("chatInput").value.toLowerCase();
    let output = "I couldn't understand.";

    if (input.includes("aspirin") && input.includes("warfarin")) {
        output = "⚠️ These drugs have HIGH interaction risk.";
    }
    else if (input.includes("paracetamol") && input.includes("ibuprofen")) {
        output = "🟡 Mild interaction, usually safe in limited use.";
    }
    else {
        output = "✅ No major interaction found.";
    }

    document.getElementById("chatResult").textContent = output;
}

// Load on start
renderList();