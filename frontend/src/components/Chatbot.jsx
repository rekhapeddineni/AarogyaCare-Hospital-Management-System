
import react, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 Welcome to AarogyaCare. How can I help you today?"
        }
    ]);

    // =====================================================
    // DOCTORS
    // IMPORTANT:
    // Each doctor is mapped to ONE specialization only.
    // =====================================================

    const doctors = {
        "General Medicine": "Dr. Arun Kumar",
        "Cardiology": "Dr. Sudarshan",
        "Dermatology": "Dr. Priya Sharma",
        "Ophthalmology": "Dr. Anjali",
        "ENT": "Dr. Rajesh Kumar",
        "Dentistry": "Dr. Meena",
        "Orthopedics": "Dr. Suresh Reddy",
        "Neurology": "Dr. Ravi Kumar",
        "Gynecology": "Dr. Lakshmi",
        "Pediatrics": "Dr. Sneha Reddy",
        "Urology": "Dr. Kiran",
        "Pulmonology": "Dr. Vikram"
    };

    // =====================================================
    // CREATE DOCTOR RESPONSE
    // =====================================================

    const createDoctorReply = (specialization, message) => {
        const doctor = doctors[specialization];

        return `${message}

👨‍⚕️ Recommended Doctor
Doctor: ${doctor}
Specialization: ${specialization}

Please consult the doctor for proper evaluation and treatment. 🩺`;
    };

    // =====================================================
    // CHATBOT LOGIC
    // =====================================================

    const getBotReply = (text) => {
        const userText = text.toLowerCase().trim();

        // =================================================
        // GREETING
        // =================================================

        if (
            /^(hi|hello|hey|hii|good morning|good afternoon|good evening)$/.test(
                userText
            )
        ) {
            return "Hello! 👋 Welcome to AarogyaCare. Please tell me your symptoms and I will suggest the appropriate department and doctor.";
        }

        // =================================================
        // CHEST / HEART
        // Cardiology
        // =================================================

        if (
            userText.includes("chest pain") ||
            userText.includes("chest discomfort") ||
            userText.includes("heart pain") ||
            userText.includes("heart problem") ||
            userText.includes("heart disease") ||
            userText.includes("palpitation") ||
            userText.includes("palpitations")
        ) {
            return createDoctorReply(
                "Cardiology",
                "❤️ Chest or heart-related symptoms should be evaluated by a Cardiology specialist. If chest pain is severe or accompanied by breathing difficulty, sweating, fainting, or severe weakness, seek emergency medical care immediately."
            );
        }

        // =================================================
        // SKIN
        // Dermatology
        // =================================================

        if (
            userText.includes("skin") ||
            userText.includes("skin problem") ||
            userText.includes("skin disease") ||
            userText.includes("rash") ||
            userText.includes("rashes") ||
            userText.includes("acne") ||
            userText.includes("pimples") ||
            userText.includes("itching") ||
            userText.includes("itchy skin") ||
            userText.includes("eczema")
        ) {
            return createDoctorReply(
                "Dermatology",
                "🧴 Skin problems such as rashes, acne, itching, eczema, and other skin conditions should be evaluated by a Dermatology specialist."
            );
        }

        // =================================================
        // EYE
        // Ophthalmology
        // =================================================

        if (
            userText.includes("eye") ||
            userText.includes("eyes") ||
            userText.includes("eye pain") ||
            userText.includes("eye problem") ||
            userText.includes("vision") ||
            userText.includes("blurred vision") ||
            userText.includes("blurry vision") ||
            userText.includes("red eyes")
        ) {
            return createDoctorReply(
                "Ophthalmology",
                "👁️ Eye problems, eye pain, blurred vision, or other vision-related symptoms should be evaluated by an Ophthalmology specialist."
            );
        }

        // =================================================
        // EAR / NOSE / THROAT
        // ENT
        // =================================================

        if (
            userText.includes("ear pain") ||
            userText.includes("ear problem") ||
            userText.includes("hearing problem") ||
            userText.includes("hearing loss") ||
            userText.includes("ear infection") ||
            userText.includes("sore throat") ||
            userText.includes("throat pain") ||
            userText.includes("tonsil") ||
            userText.includes("tonsils") ||
            userText.includes("nose problem") ||
            userText.includes("sinus")
        ) {
            return createDoctorReply(
                "ENT",
                "👂 Ear, nose, and throat problems should be evaluated by an ENT specialist."
            );
        }

        // =================================================
        // DENTAL
        // Dentistry
        // =================================================

        if (
            userText.includes("tooth") ||
            userText.includes("toothache") ||
            userText.includes("teeth") ||
            userText.includes("dental") ||
            userText.includes("gum pain") ||
            userText.includes("gum problem")
        ) {
            return createDoctorReply(
                "Dentistry",
                "🦷 Tooth, teeth, gum, and other dental problems should be evaluated by a Dentist."
            );
        }

        // =================================================
        // BONE / JOINT
        // Orthopedics
        // =================================================

        if (
            userText.includes("bone") ||
            userText.includes("bone pain") ||
            userText.includes("joint pain") ||
            userText.includes("knee pain") ||
            userText.includes("shoulder pain") ||
            userText.includes("back pain") ||
            userText.includes("neck pain") ||
            userText.includes("fracture") ||
            userText.includes("sprain") ||
            userText.includes("arthritis")
        ) {
            return createDoctorReply(
                "Orthopedics",
                "🦴 Bone, joint, knee, shoulder, back, fracture, and other musculoskeletal problems should be evaluated by an Orthopedics specialist."
            );
        }

        // =================================================
        // NEUROLOGY
        // =================================================

        if (
            userText.includes("seizure") ||
            userText.includes("seizures") ||
            userText.includes("numbness") ||
            userText.includes("tingling") ||
            userText.includes("memory problem") ||
            userText.includes("memory loss") ||
            userText.includes("nerve problem") ||
            userText.includes("tremor") ||
            userText.includes("trembling")
        ) {
            return createDoctorReply(
                "Neurology",
                "🧠 Neurological symptoms such as seizures, numbness, memory problems, tremors, and nerve-related symptoms should be evaluated by a Neurology specialist."
            );
        }

        // =================================================
        // WOMEN'S HEALTH
        // Gynecology
        // =================================================

        if (
            userText.includes("pregnancy") ||
            userText.includes("pregnant") ||
            userText.includes("period problem") ||
            userText.includes("period pain") ||
            userText.includes("irregular periods") ||
            userText.includes("menstrual") ||
            userText.includes("gynecology") ||
            userText.includes("ovary") ||
            userText.includes("ovarian")
        ) {
            return createDoctorReply(
                "Gynecology",
                "🤰 Pregnancy, menstrual, ovarian, and other women's health concerns should be evaluated by a Gynecology specialist."
            );
        }

        // =================================================
        // CHILDREN
        // Pediatrics
        // =================================================

        if (
            userText.includes("child") ||
            userText.includes("children") ||
            userText.includes("baby") ||
            userText.includes("infant") ||
            userText.includes("kid") ||
            userText.includes("kids")
        ) {
            return createDoctorReply(
                "Pediatrics",
                "👶 Health problems in babies, children, and teenagers should be evaluated by a Pediatrics specialist."
            );
        }

        // =================================================
        // URINARY / KIDNEY
        // Urology
        // =================================================

        if (
            userText.includes("urine") ||
            userText.includes("urinary") ||
            userText.includes("urination") ||
            userText.includes("pain while urinating") ||
            userText.includes("burning urine") ||
            userText.includes("kidney stone") ||
            userText.includes("kidney stones") ||
            userText.includes("urology")
        ) {
            return createDoctorReply(
                "Urology",
                "🩺 Urinary problems, painful urination, kidney stones, and other urinary-system problems should be evaluated by a Urology specialist."
            );
        }

        // =================================================
        // BREATHING
        // Pulmonology
        // =================================================

        if (
            userText.includes("breathing problem") ||
            userText.includes("breathing difficulty") ||
            userText.includes("difficulty breathing") ||
            userText.includes("shortness of breath") ||
            userText.includes("breathlessness") ||
            userText.includes("breathless") ||
            userText.includes("asthma") ||
            userText.includes("wheezing")
        ) {
            return createDoctorReply(
                "Pulmonology",
                "🫁 Breathing problems, asthma, wheezing, and other lung-related symptoms should be evaluated by a Pulmonology specialist. If you are having severe difficulty breathing, seek emergency medical care immediately."
            );
        }

        // =================================================
        // GENERAL MEDICINE
        // Fever / Cold / Cough / Headache / Stomach
        // =================================================

        if (
            userText.includes("fever") ||
            userText.includes("temperature") ||
            userText.includes("high temperature") ||
            userText.includes("cold") ||
            userText.includes("cough") ||
            userText.includes("sneezing") ||
            userText.includes("runny nose") ||
            userText.includes("headache") ||
            userText.includes("head pain") ||
            userText.includes("migraine") ||
            userText.includes("stomach pain") ||
            userText.includes("stomach ache") ||
            userText.includes("abdominal pain") ||
            userText.includes("gastric") ||
            userText.includes("vomiting") ||
            userText.includes("vomit") ||
            userText.includes("diarrhea") ||
            userText.includes("weakness") ||
            userText.includes("body pain") ||
            userText.includes("diabetes") ||
            userText.includes("blood sugar") ||
            userText.includes("sugar level") ||
            userText.includes("blood pressure") ||
            userText.includes("hypertension")
        ) {
            return createDoctorReply(
                "General Medicine",
                "🩺 These symptoms are commonly evaluated first by a General Medicine doctor. The doctor can assess your condition and refer you to another specialist if necessary."
            );
        }

        // =================================================
        // APPOINTMENT
        // =================================================

        if (
            userText.includes("appointment") ||
            userText.includes("book doctor") ||
            userText.includes("doctor appointment") ||
            userText.includes("book appointment")
        ) {
            return "📅 You can book and manage appointments from the Appointments section in the sidebar.";
        }

        // =================================================
        // DOCTORS
        // =================================================

        if (
            userText === "doctor" ||
            userText === "doctors" ||
            userText.includes("available doctors") ||
            userText.includes("doctor list")
        ) {
            return "👨‍⚕️ You can view all available doctors and their specializations from the Doctors section in the sidebar.";
        }

        // =================================================
        // PATIENTS
        // =================================================

        if (
            userText === "patient" ||
            userText === "patients" ||
            userText.includes("patient records")
        ) {
            return "👤 Patient records can be managed from the Patients section in the sidebar.";
        }

        // =================================================
        // ADMISSIONS
        // =================================================

        if (
            userText.includes("admission") ||
            userText.includes("admit") ||
            userText.includes("hospital stay")
        ) {
            return "🛏️ You can manage patient admissions and hospital stays from the Admissions section.";
        }

        // =================================================
        // PHARMACY
        // =================================================

        if (
            userText.includes("pharmacy") ||
            userText.includes("medicine") ||
            userText.includes("medicines")
        ) {
            return "💊 You can manage medicines and pharmacy information from the Pharmacy section.";
        }

        // =================================================
        // LABORATORY
        // =================================================

        if (
            userText.includes("laboratory") ||
            userText.includes("lab") ||
            userText.includes("blood test") ||
            userText.includes("test report") ||
            userText.includes("lab report")
        ) {
            return "🧪 Laboratory tests and patient reports can be managed from the Laboratory section.";
        }

        // =================================================
        // BILLING
        // =================================================

        if (
            userText.includes("billing") ||
            userText.includes("bill") ||
            userText.includes("payment")
        ) {
            return "💰 Hospital bills and payment information can be managed from the Billing section.";
        }

        // =================================================
        // DEPARTMENTS
        // =================================================

        if (
            userText === "department" ||
            userText === "departments" ||
            userText.includes("hospital departments")
        ) {
            return "🏥 AarogyaCare has departments including General Medicine, Cardiology, Dermatology, Ophthalmology, ENT, Dentistry, Orthopedics, Neurology, Gynecology, Pediatrics, Urology, and Pulmonology.";
        }

        // =================================================
        // THANK YOU
        // =================================================

        if (
            userText.includes("thank you") ||
            userText.includes("thanks")
        ) {
            return "You're welcome! 😊 I'm always here to help.";
        }

        // =================================================
        // GOODBYE
        // =================================================

        if (
            userText === "bye" ||
            userText === "goodbye"
        ) {
            return "Goodbye! 👋 Take care and stay healthy.";
        }

        // =================================================
        // DEFAULT
        // =================================================

        return "I can help you identify the appropriate hospital department and doctor based on your symptoms. You can also ask me about appointments, patients, admissions, pharmacy, laboratory, billing, or departments. Please describe your symptoms.";
    };

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSend = () => {
        if (!message.trim()) {
            return;
        }

        const userMessage = {
            sender: "user",
            text: message.trim()
        };

        setMessages((previous) => [
            ...previous,
            userMessage
        ]);

        const reply = getBotReply(message);

        setMessage("");

        setTimeout(() => {
            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text: reply
                }
            ]);
        }, 500);
    };

    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    return (
        <>
            {/* CHAT BUTTON */}

            <button
                className="chatbot-button"
                onClick={() => setOpen(!open)}
                type="button"
            >
                💬
            </button>

            {/* CHAT WINDOW */}

            {open && (
                <div className="chatbot-window">

                    {/* HEADER */}

                    <div className="chatbot-header">

                        <div>
                            <strong>
                                AarogyaCare Assistant
                            </strong>

                            <span>
                                ● Online
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                    </div>

                    {/* MESSAGES */}

                    <div className="chatbot-messages">

                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`chat-message ${item.sender}`}
                            >
                                {item.text}
                            </div>
                        ))}

                    </div>

                    {/* INPUT */}

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Describe your symptoms..."
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                        >
                            ➤
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default Chatbot;

