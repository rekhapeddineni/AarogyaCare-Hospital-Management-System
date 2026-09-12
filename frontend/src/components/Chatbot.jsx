import React, { useEffect, useState } from "react";
import "./Chatbot.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api";

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [doctors, setDoctors] = useState([]);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 Welcome to AarogyaCare. How can I help you today?"
        }
    ]);

    // =========================================================
    // LOAD DOCTORS FROM DATABASE
    // =========================================================

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const response = await fetch(`${API_URL}/doctors/`);

            if (!response.ok) {
                throw new Error("Doctor API failed");
            }

            const data = await response.json();

            console.log("Doctors loaded from database:", data);

            if (Array.isArray(data)) {
                setDoctors(data);
            } else if (Array.isArray(data.results)) {
                setDoctors(data.results);
            } else {
                setDoctors([]);
            }
        } catch (error) {
            console.error("Doctor loading error:", error);
            setDoctors([]);
        }
    };

    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    const normalize = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // =========================================================
    // DEPARTMENT ALIASES
    // =========================================================

    const departmentAliases = {
        "General Medicine": [
            "general medicine",
            "general doctor",
            "general physician",
            "physician",
            "general health"
        ],

        Cardiology: [
            "cardiology",
            "cardiologist",
            "heart doctor",
            "heart specialist",
            "cardiac"
        ],

        Dermatology: [
            "dermatology",
            "dermatologist",
            "skin doctor",
            "skin specialist",
            "skin department"
        ],

        Ophthalmology: [
            "ophthalmology",
            "ophthalmologist",
            "eye doctor",
            "eye specialist",
            "eye department"
        ],

        ENT: [
            "ent",
            "ent doctor",
            "ent specialist",
            "ear doctor",
            "nose doctor",
            "throat doctor"
        ],

        Dentistry: [
            "dentistry",
            "dentist",
            "dental",
            "dental doctor",
            "teeth doctor",
            "tooth doctor"
        ],

        Orthopedics: [
            "orthopedics",
            "orthopedic",
            "orthopaedic",
            "orthopaedics",
            "bone doctor",
            "joint doctor"
        ],

        Neurology: [
            "neurology",
            "neurologist",
            "neurosurgeon",
            "brain doctor",
            "nerve doctor"
        ],

        Gynecology: [
            "gynecology",
            "gynecologist",
            "gynaecology",
            "gynaecologist",
            "women doctor"
        ],

        Pediatrics: [
            "pediatrics",
            "pediatrician",
            "paediatrics",
            "paediatrician",
            "child doctor",
            "children doctor",
            "baby doctor"
        ],

        Urology: [
            "urology",
            "urologist",
            "urine doctor",
            "urinary doctor",
            "kidney doctor"
        ],

        Pulmonology: [
            "pulmonology",
            "pulmonologist",
            "lung doctor",
            "lung specialist",
            "respiratory doctor"
        ]
    };

    // =========================================================
    // SYMPTOMS
    // =========================================================

    const symptoms = {
        "General Medicine": [
            "fever",
            "temperature",
            "cold",
            "flu",
            "cough",
            "sneeze",
            "sneezing",
            "runny nose",
            "blocked nose",
            "headache",
            "head pain",
            "body pain",
            "body ache",
            "body aches",
            "weakness",
            "weak",
            "tired",
            "tiredness",
            "fatigue",
            "vomiting",
            "vomit",
            "nausea",
            "diarrhea",
            "diarrhoea",
            "loose motion",
            "loose motions",
            "constipation",
            "gas",
            "gastric",
            "gas problem",
            "acidity",
            "acid reflux",
            "heartburn",
            "indigestion",
            "stomach pain",
            "stomach ache",
            "belly pain",
            "abdominal pain",
            "loss of appetite",
            "appetite problem",
            "infection",
            "viral infection",
            "diabetes",
            "diabetic",
            "blood sugar",
            "high sugar",
            "blood pressure",
            "high bp",
            "low bp",
            "hypertension",
            "cholesterol"
        ],

        Cardiology: [
            "heart",
            "heart problem",
            "heart problems",
            "heart issue",
            "heart issues",
            "heart disease",
            "heart condition",
            "heart pain",
            "heart hurts",
            "problem with my heart",
            "something wrong with my heart",
            "pain near heart",
            "pain around heart",
            "pain in heart area",
            "chest pain",
            "chest hurts",
            "my chest hurts",
            "pain in chest",
            "chest discomfort",
            "chest pressure",
            "pressure in chest",
            "chest tightness",
            "tightness in chest",
            "chest heaviness",
            "heavy chest",
            "heavy feeling in chest",
            "heart beating fast",
            "heart is beating fast",
            "fast heartbeat",
            "fast heart beat",
            "racing heart",
            "heart racing",
            "heart pounding",
            "pounding heart",
            "palpitation",
            "palpitations",
            "irregular heartbeat",
            "irregular heart beat",
            "heartbeat problem",
            "heartbeat problems",
            "cardiac problem",
            "cardiac issue",
            "cardiovascular problem"
        ],

        Dermatology: [
            "skin",
            "skin problem",
            "skin problems",
            "skin issue",
            "skin issues",
            "skin disease",
            "skin condition",
            "skin infection",
            "skin rash",
            "rash",
            "rashes",
            "red rash",
            "red patches",
            "redness",
            "skin redness",
            "itch",
            "itching",
            "itchy",
            "itchy skin",
            "skin is itchy",
            "skin very itchy",
            "skin burning",
            "burning skin",
            "skin irritation",
            "skin allergy",
            "allergy on skin",
            "acne",
            "pimple",
            "pimples",
            "face pimples",
            "pimples on face",
            "facial acne",
            "breakouts",
            "blackheads",
            "whiteheads",
            "eczema",
            "psoriasis",
            "dry skin",
            "very dry skin",
            "oily skin",
            "skin bumps",
            "bumps on skin",
            "dark spots",
            "skin spots",
            "pigmentation",
            "hair fall",
            "hair loss",
            "falling hair",
            "dandruff",
            "itchy scalp",
            "scalp problem",
            "scalp infection",
            "nail problem",
            "nail infection",
            "fungal infection",
            "ringworm",
            "warts",
            "boils"
        ],

        Ophthalmology: [
            "eye",
            "eyes",
            "eye problem",
            "eye problems",
            "eye issue",
            "eye issues",
            "eye pain",
            "eyes hurt",
            "my eyes hurt",
            "my eye hurts",
            "pain in eye",
            "pain in eyes",
            "vision problem",
            "vision problems",
            "vision issue",
            "eyesight problem",
            "weak eyesight",
            "blurred vision",
            "blurry vision",
            "can't see clearly",
            "cannot see clearly",
            "difficulty seeing",
            "poor vision",
            "red eye",
            "red eyes",
            "watery eyes",
            "watering eyes",
            "dry eyes",
            "itchy eyes",
            "eye itching",
            "eye infection",
            "eye swelling",
            "swollen eye",
            "eye discharge",
            "double vision",
            "seeing double",
            "eye strain",
            "light hurts my eyes",
            "sensitivity to light"
        ],

        ENT: [
            "ear",
            "ears",
            "ear problem",
            "ear problems",
            "ear issue",
            "ear pain",
            "ear hurts",
            "my ear hurts",
            "pain in ear",
            "ear infection",
            "ear blockage",
            "blocked ear",
            "hearing problem",
            "hearing problems",
            "hearing issue",
            "hearing loss",
            "can't hear",
            "cannot hear",
            "can't hear properly",
            "cannot hear properly",
            "reduced hearing",
            "ringing in ear",
            "ringing in ears",
            "ear ringing",
            "tinnitus",
            "throat problem",
            "throat pain",
            "sore throat",
            "my throat hurts",
            "pain in throat",
            "throat infection",
            "difficulty swallowing",
            "pain while swallowing",
            "tonsil",
            "tonsils",
            "tonsillitis",
            "nose problem",
            "nose problems",
            "blocked nose",
            "stuffy nose",
            "nose bleeding",
            "nosebleed",
            "sinus",
            "sinus problem",
            "sinus pain",
            "sinus pressure",
            "facial pressure",
            "loss of smell",
            "smell problem",
            "voice problem",
            "hoarse voice",
            "hoarseness"
        ],

        Dentistry: [
            "tooth",
            "teeth",
            "dental",
            "dentist",
            "tooth problem",
            "teeth problem",
            "dental problem",
            "dental issue",
            "tooth pain",
            "toothache",
            "tooth ache",
            "my tooth hurts",
            "tooth hurts",
            "pain in tooth",
            "gum",
            "gums",
            "gum pain",
            "gum problem",
            "bleeding gums",
            "swollen gums",
            "sensitive teeth",
            "tooth sensitivity",
            "cavity",
            "cavities",
            "bad breath",
            "mouth pain",
            "mouth ulcer",
            "mouth ulcers",
            "tooth infection",
            "broken tooth",
            "loose tooth",
            "wisdom tooth",
            "wisdom tooth pain",
            "jaw pain"
        ],

        Orthopedics: [
            "bone",
            "bones",
            "bone pain",
            "bone problem",
            "joint",
            "joints",
            "joint pain",
            "joint problem",
            "joint stiffness",
            "stiff joints",
            "knee",
            "knees",
            "knee pain",
            "my knee hurts",
            "pain in knee",
            "knee injury",
            "shoulder",
            "shoulder pain",
            "my shoulder hurts",
            "pain in shoulder",
            "shoulder injury",
            "back pain",
            "my back hurts",
            "lower back pain",
            "upper back pain",
            "back injury",
            "neck pain",
            "my neck hurts",
            "pain in neck",
            "hip pain",
            "hip problem",
            "leg pain",
            "arm pain",
            "wrist pain",
            "ankle pain",
            "foot pain",
            "heel pain",
            "muscle pain",
            "muscle injury",
            "sports injury",
            "fracture",
            "broken bone",
            "broken arm",
            "broken leg",
            "sprain",
            "arthritis",
            "swollen joint",
            "difficulty walking",
            "difficulty moving"
        ],

        Neurology: [
            "brain problem",
            "brain issue",
            "nerve",
            "nerves",
            "nerve problem",
            "nerve pain",
            "neurological problem",
            "neurology",
            "dizziness",
            "dizzy",
            "feeling dizzy",
            "vertigo",
            "numbness",
            "numb",
            "numbness in hand",
            "numbness in leg",
            "numbness in face",
            "tingling",
            "tingling sensation",
            "pins and needles",
            "seizure",
            "seizures",
            "fit",
            "fits",
            "convulsion",
            "convulsions",
            "tremor",
            "tremors",
            "shaking",
            "hands shaking",
            "memory problem",
            "memory problems",
            "memory loss",
            "forgetfulness",
            "forgetting things",
            "balance problem",
            "loss of balance",
            "speech problem",
            "difficulty speaking",
            "fainting",
            "blackout",
            "confusion",
            "migraine",
            "severe headache",
            "frequent headache"
        ],

        Gynecology: [
            "period",
            "periods",
            "period problem",
            "period problems",
            "period pain",
            "painful period",
            "painful periods",
            "irregular period",
            "irregular periods",
            "late period",
            "late periods",
            "missed period",
            "heavy period",
            "heavy periods",
            "heavy menstrual bleeding",
            "menstrual problem",
            "menstrual problems",
            "menstrual pain",
            "pregnancy",
            "pregnant",
            "pregnancy problem",
            "pregnancy issue",
            "ovary",
            "ovarian",
            "ovary pain",
            "ovarian cyst",
            "pelvic pain",
            "pelvic problem",
            "vaginal pain",
            "vaginal bleeding",
            "unusual bleeding",
            "menopause",
            "menopause problem",
            "pcos",
            "pcod",
            "fertility problem",
            "fertility issue"
        ],

        Pediatrics: [
            "baby",
            "babies",
            "infant",
            "child",
            "children",
            "kid",
            "kids",
            "my child",
            "my baby",
            "my kid",
            "child health",
            "baby health",
            "fever in child",
            "fever in baby",
            "child fever",
            "baby fever",
            "child cough",
            "baby cough",
            "child cold",
            "baby cold",
            "child vomiting",
            "baby vomiting",
            "child diarrhea",
            "baby diarrhea",
            "child weakness",
            "baby weakness",
            "child breathing problem",
            "baby breathing problem",
            "child not eating",
            "baby not eating"
        ],

        Urology: [
            "urine",
            "urinary",
            "urination",
            "urine problem",
            "urine problems",
            "urinary problem",
            "urinary issue",
            "urination problem",
            "difficulty urinating",
            "trouble urinating",
            "pain while urinating",
            "pain when urinating",
            "burning urine",
            "burning while urinating",
            "burning sensation while urinating",
            "frequent urination",
            "urinating frequently",
            "blood in urine",
            "blood while urinating",
            "kidney",
            "kidney problem",
            "kidney pain",
            "kidney stone",
            "kidney stones",
            "bladder",
            "bladder problem",
            "bladder pain",
            "urine infection",
            "urinary infection",
            "uti",
            "unable to urinate",
            "urine leakage",
            "bladder control",
            "prostate",
            "prostate problem"
        ],

        Pulmonology: [
            "lung",
            "lungs",
            "lung problem",
            "lung issue",
            "lung infection",
            "breathing",
            "breathing problem",
            "breathing problems",
            "breathing issue",
            "difficulty breathing",
            "trouble breathing",
            "can't breathe",
            "cannot breathe",
            "can't breathe properly",
            "cannot breathe properly",
            "difficulty in breathing",
            "shortness of breath",
            "short of breath",
            "breathlessness",
            "breathless",
            "feeling breathless",
            "wheezing",
            "wheeze",
            "asthma",
            "asthma attack",
            "persistent cough",
            "continuous cough",
            "cough for many days",
            "cough for weeks",
            "coughing blood",
            "chest congestion",
            "phlegm",
            "mucus in chest"
        ]
    };

    // =========================================================
    // FIND DEPARTMENT
    // =========================================================

    const findDepartment = (userText) => {
        const text = normalize(userText);

        // Check direct department names first.
        for (const department in departmentAliases) {
            for (const alias of departmentAliases[department]) {
                if (
                    text === alias ||
                    text.includes(alias)
                ) {
                    return department;
                }
            }
        }

        const scores = {};

        Object.keys(symptoms).forEach((department) => {
            scores[department] = 0;
        });

        // Score matching symptoms.
        for (const department in symptoms) {
            for (const keyword of symptoms[department]) {
                const cleanKeyword = normalize(keyword);

                if (text.includes(cleanKeyword)) {
                    if (cleanKeyword.includes(" ")) {
                        scores[department] += 3;
                    } else {
                        scores[department] += 1;
                    }
                }
            }
        }

        // Child-specific problems.
        if (
            text.includes("child") ||
            text.includes("baby") ||
            text.includes("kid") ||
            text.includes("infant") ||
            text.includes("children")
        ) {
            scores["Pediatrics"] += 15;
        }

        // Heart-specific problems.
        if (
            text.includes("heart") ||
            (
                text.includes("chest") &&
                (
                    text.includes("pain") ||
                    text.includes("pressure") ||
                    text.includes("tight") ||
                    text.includes("heavy") ||
                    text.includes("discomfort")
                )
            )
        ) {
            scores["Cardiology"] += 12;
        }

        // Breathing-specific problems.
        if (
            text.includes("breathing") ||
            text.includes("breathless") ||
            text.includes("shortness of breath") ||
            text.includes("wheezing") ||
            text.includes("asthma")
        ) {
            scores["Pulmonology"] += 10;
        }

        // Skin-specific problems.
        if (
            text.includes("skin") &&
            (
                text.includes("itch") ||
                text.includes("rash") ||
                text.includes("red") ||
                text.includes("pimple") ||
                text.includes("infection") ||
                text.includes("dry") ||
                text.includes("burn")
            )
        ) {
            scores["Dermatology"] += 12;
        }

        // Eye-specific problems.
        if (
            text.includes("eye") ||
            text.includes("eyes") ||
            text.includes("vision") ||
            text.includes("eyesight")
        ) {
            scores["Ophthalmology"] += 12;
        }

        // Dental-specific problems.
        if (
            text.includes("tooth") ||
            text.includes("teeth") ||
            text.includes("gum") ||
            text.includes("dental")
        ) {
            scores["Dentistry"] += 12;
        }

        // Urinary/kidney-specific problems.
        if (
            text.includes("urine") ||
            text.includes("urinary") ||
            text.includes("urinating") ||
            text.includes("kidney") ||
            text.includes("bladder")
        ) {
            scores["Urology"] += 12;
        }

        // Women's health.
        if (
            text.includes("period") ||
            text.includes("pregnan") ||
            text.includes("ovary") ||
            text.includes("pelvic") ||
            text.includes("pcos") ||
            text.includes("pcod")
        ) {
            scores["Gynecology"] += 12;
        }

        // Bones and joints.
        if (
            text.includes("knee") ||
            text.includes("shoulder") ||
            text.includes("bone") ||
            text.includes("joint") ||
            text.includes("fracture") ||
            text.includes("sprain") ||
            text.includes("back pain")
        ) {
            scores["Orthopedics"] += 10;
        }

        // Neurological problems.
        if (
            text.includes("numb") ||
            text.includes("tingling") ||
            text.includes("seizure") ||
            text.includes("tremor") ||
            text.includes("memory") ||
            text.includes("vertigo")
        ) {
            scores["Neurology"] += 10;
        }

        let bestDepartment = null;
        let bestScore = 0;

        Object.entries(scores).forEach(
            ([department, score]) => {
                if (score > bestScore) {
                    bestScore = score;
                    bestDepartment = department;
                }
            }
        );

        return bestDepartment;
    };

    // =========================================================
    // FIND DOCTOR FROM DATABASE
    // =========================================================

    const findDoctorForDepartment = (department) => {
        if (
            !Array.isArray(doctors) ||
            doctors.length === 0
        ) {
            return null;
        }

        const departmentName = normalize(department);

        const matchingRules = {
            "general medicine": [
                "general",
                "physician",
                "medicine"
            ],

            cardiology: [
                "cardiolog",
                "cardiac"
            ],

            dermatology: [
                "dermatolog",
                "skin"
            ],

            ophthalmology: [
                "ophthalm",
                "optom",
                "eye"
            ],

            ent: [
                "ent",
                "otolaryng",
                "ear",
                "nose",
                "throat"
            ],

            dentistry: [
                "dent",
                "dental"
            ],

            orthopedics: [
                "orthopedic",
                "orthopaedic",
                "orthoped",
                "bone"
            ],

            neurology: [
                "neurolog",
                "neurosurgeon",
                "neuro"
            ],

            gynecology: [
                "gynec",
                "gynaec",
                "women"
            ],

            pediatrics: [
                "pediatric",
                "paediatric",
                "child"
            ],

            urology: [
                "urolog",
                "urinary"
            ],

            pulmonology: [
                "pulmon",
                "respir",
                "lung"
            ]
        };

        const rules =
            matchingRules[departmentName] || [
                departmentName
            ];

        // -----------------------------------------------------
        // FIRST: SEARCH SPECIALIZATION
        // -----------------------------------------------------

        let doctor = doctors.find((item) => {
            const specialization = normalize(
                item.specialization || ""
            );

            return rules.some((rule) =>
                specialization.includes(rule)
            );
        });

        if (doctor) {
            return doctor;
        }

        // -----------------------------------------------------
        // SECOND: SEARCH DEPARTMENT FIELD
        // -----------------------------------------------------

        doctor = doctors.find((item) => {
            const dbDepartment = normalize(
                item.department || ""
            );

            return rules.some((rule) =>
                dbDepartment.includes(rule)
            );
        });

        return doctor || null;
    };

    // =========================================================
    // DEPARTMENT RESPONSE
    // =========================================================

    const getDepartmentReply = (department) => {
        const doctor =
            findDoctorForDepartment(department);

        let description = "";

        if (department === "Cardiology") {
            description =
                "Heart and cardiovascular problems such as chest discomfort, palpitations and blood-pressure-related concerns.";
        } else if (department === "Dermatology") {
            description =
                "Skin, hair and nail problems including rashes, itching, acne, infections and hair loss.";
        } else if (department === "Ophthalmology") {
            description =
                "Eye and vision problems including blurred vision, eye pain, redness and infections.";
        } else if (department === "ENT") {
            description =
                "Ear, nose and throat problems including ear pain, hearing problems, sinus issues and sore throat.";
        } else if (department === "Dentistry") {
            description =
                "Teeth, gums and mouth problems including toothache, cavities, gum swelling and dental infections.";
        } else if (department === "Orthopedics") {
            description =
                "Bone, joint and muscle problems including back pain, knee pain, fractures and injuries.";
        } else if (department === "Neurology") {
            description =
                "Brain and nerve-related problems including numbness, seizures, tremors, dizziness and memory problems.";
        } else if (department === "Gynecology") {
            description =
                "Women's reproductive and gynecological concerns including period problems, pregnancy-related concerns and pelvic problems.";
        } else if (department === "Pediatrics") {
            description =
                "Healthcare for babies, children and adolescents.";
        } else if (department === "Urology") {
            description =
                "Urinary system and kidney-related problems including burning urination, kidney stones and urinary infections.";
        } else if (department === "Pulmonology") {
            description =
                "Lung and breathing problems including asthma, wheezing, persistent cough and breathing difficulty.";
        } else {
            description =
                "General health problems, common illnesses, infections, weakness and other general medical concerns.";
        }

        let reply = `🏥 ${department}

${description}`;

        // -----------------------------------------------------
        // DATABASE DOCTOR
        // -----------------------------------------------------

        if (doctor) {
            reply += `

👨‍⚕️ Recommended Doctor

${doctor.doctor_name || "Doctor name unavailable"}

🩺 ${doctor.specialization || "Specialization not specified"}`;

            if (
                doctor.experience !== undefined &&
                doctor.experience !== null
            ) {
                reply += ` • ${doctor.experience} years experience`;
            }
        } else {
            reply += `

👨‍⚕️ Recommended Doctor

No doctor is currently registered for this department in the Doctors module.`;
        }

        reply += `

Please consult the doctor for proper evaluation and treatment. 🩺`;

        return reply;
    };

    // =========================================================
    // EMERGENCY CHECK
    // =========================================================

    const isEmergency = (text) => {
        const emergencyWords = [
            "severe chest pain",
            "crushing chest pain",
            "heavy chest pain",
            "chest pain and sweating",
            "chest pain and fainting",
            "chest pain and difficulty breathing",
            "unable to breathe",
            "not breathing",
            "unconscious",
            "unresponsive",
            "face drooping",
            "one side of body weak",
            "sudden paralysis",
            "sudden loss of vision",
            "heavy bleeding",
            "uncontrolled bleeding",
            "severe bleeding",
            "continuous seizure",
            "severe allergic reaction",
            "anaphylaxis",
            "poisoning",
            "overdose"
        ];

        return emergencyWords.some((word) =>
            text.includes(word)
        );
    };

    // =========================================================
    // EMERGENCY RESPONSE
    // =========================================================

    const getEmergencyReply = () => {
        return `🚨 EMERGENCY

Your message may describe a potentially serious medical situation.

Please seek emergency medical care immediately or contact your local emergency service.

If you are already at the hospital, inform the emergency or medical staff immediately.

Do not wait for a chatbot response if symptoms are severe, sudden or getting worse.`;
    };

    // =========================================================
    // DOCTORS LIST
    // =========================================================

    const getDoctorsReply = () => {
        if (
            !Array.isArray(doctors) ||
            doctors.length === 0
        ) {
            return `👨‍⚕️ Doctors

No doctors are currently available in the database.`;
        }

        let reply =
            "👨‍⚕️ Doctors Available in AarogyaCare\n\n";

        doctors.forEach((doctor, index) => {
            reply += `${index + 1}. ${
                doctor.doctor_name || "Doctor"
            }

Specialization: ${
                doctor.specialization ||
                "Not specified"
            }

Department: ${
                doctor.department ||
                "Not specified"
            }`;

            if (
                doctor.experience !== undefined &&
                doctor.experience !== null
            ) {
                reply += `
Experience: ${doctor.experience} years`;
            }

            if (doctor.doctor_id) {
                reply += `
Doctor ID: ${doctor.doctor_id}`;
            }

            reply += "\n\n";
        });

        return reply.trim();
    };

    // =========================================================
    // MAIN BOT RESPONSE
    // =========================================================

    const getBotReply = (userMessage) => {
        const text = normalize(userMessage);

        // Emergency first.
        if (isEmergency(text)) {
            return getEmergencyReply();
        }

        // -----------------------------------------------------
        // GREETINGS
        // -----------------------------------------------------

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text.includes("good morning") ||
            text.includes("good afternoon") ||
            text.includes("good evening")
        ) {
            return `Hello! 👋

Welcome to AarogyaCare Hospital.

You can describe your symptoms in your own words.

For example:

❤️ "My chest hurts"

🧴 "My skin is very itchy"

👁️ "My vision is blurry"

🦷 "My tooth hurts"

🦴 "My knee hurts"

🧠 "My hand feels numb"

👂 "I can't hear properly"

🫁 "I feel breathless"

🚻 "It burns when I urinate"

👩 "My periods are irregular"

👶 "My child has fever"`;
        }

        // -----------------------------------------------------
        // DOCTORS
        // -----------------------------------------------------

        if (
            text === "doctor" ||
            text === "doctors" ||
            text.includes("doctor list") ||
            text.includes("list of doctors") ||
            text.includes("show doctors") ||
            text.includes("available doctors") ||
            text.includes("which doctors")
        ) {
            return getDoctorsReply();
        }

        // -----------------------------------------------------
        // DEPARTMENTS
        // -----------------------------------------------------

        if (
            text === "department" ||
            text === "departments" ||
            text.includes("department list") ||
            text.includes("list of departments") ||
            text.includes("hospital departments") ||
            text.includes("show departments")
        ) {
            return `🏥 AarogyaCare Departments

• General Medicine
• Cardiology
• Dermatology
• Ophthalmology
• ENT
• Dentistry
• Orthopedics
• Neurology
• Gynecology
• Pediatrics
• Urology
• Pulmonology

You can type a department name or describe your symptoms.`;
        }

        // -----------------------------------------------------
        // APPOINTMENTS
        // -----------------------------------------------------

        if (
            text.includes("appointment") ||
            text.includes("book doctor") ||
            text.includes("book appointment") ||
            text.includes("schedule appointment") ||
            text.includes("doctor appointment")
        ) {
            return `📅 Appointments

You can book and manage appointments from the Appointments module.

You can select:

• Patient
• Doctor
• Appointment date
• Appointment time
• Appointment status`;
        }

        // -----------------------------------------------------
        // PATIENTS
        // -----------------------------------------------------

        if (
            text === "patient" ||
            text === "patients" ||
            text.includes("patient records") ||
            text.includes("patient record") ||
            text.includes("patient details") ||
            text.includes("patient list")
        ) {
            return `👤 Patients

The Patients module allows you to:

• Add patients
• View patient records
• Edit patient information
• Delete patient records

Patient information is stored in the hospital database.`;
        }

        // -----------------------------------------------------
        // ADMISSIONS
        // -----------------------------------------------------

        if (
            text.includes("admission") ||
            text.includes("admissions") ||
            text.includes("admit patient") ||
            text.includes("hospital admission")
        ) {
            return `🏥 Admissions

The Admissions module allows you to manage:

• Patient admissions
• Admission dates
• Room information
• Admission status
• Patient admission records`;
        }

        // -----------------------------------------------------
        // PHARMACY
        // -----------------------------------------------------

        if (
            text.includes("pharmacy") ||
            text === "medicine" ||
            text === "medicines" ||
            text.includes("medicine stock") ||
            text.includes("medical stock")
        ) {
            return `💊 Pharmacy

The Pharmacy module allows you to manage:

• Medicines
• Medicine stock
• Prices
• Manufacturers
• Batch numbers
• Expiry dates`;
        }

        // -----------------------------------------------------
        // LABORATORY
        // -----------------------------------------------------

        if (
            text === "lab" ||
            text.includes("laboratory") ||
            text.includes("lab test") ||
            text.includes("lab tests") ||
            text.includes("blood test") ||
            text.includes("test report") ||
            text.includes("lab report")
        ) {
            return `🧪 Laboratory

The Laboratory module allows you to manage:

• Lab tests
• Patient test records
• Test results
• Laboratory information`;
        }

        // -----------------------------------------------------
        // BILLING
        // -----------------------------------------------------

        if (
            text === "bill" ||
            text === "billing" ||
            text.includes("hospital bill") ||
            text.includes("bill details") ||
            text.includes("payment") ||
            text.includes("billing details")
        ) {
            return `💳 Billing

The Billing module allows you to manage:

• Patient bills
• Consultation charges
• Hospital charges
• Payment information
• Billing records`;
        }

        // -----------------------------------------------------
        // THANKS
        // -----------------------------------------------------

        if (
            text === "thanks" ||
            text === "thank you" ||
            text.includes("thanks a lot")
        ) {
            return `You're welcome! 😊

AarogyaCare is always here to help. 🏥`;
        }

        // -----------------------------------------------------
        // GOODBYE
        // -----------------------------------------------------

        if (
            text === "bye" ||
            text === "goodbye" ||
            text.includes("see you")
        ) {
            return `Goodbye! 👋

Take care and stay healthy! 🩺`;
        }

        // -----------------------------------------------------
        // SYMPTOM DETECTION
        // -----------------------------------------------------

        const department = findDepartment(text);

        if (department) {
            return getDepartmentReply(department);
        }

        // -----------------------------------------------------
        // UNKNOWN MESSAGE
        // -----------------------------------------------------

        return `I couldn't confidently identify the appropriate department from that description.

Please describe the problem in your own words.

For example:

❤️ "Something is wrong with my heart"

🧴 "I have red itchy patches on my skin"

👁️ "Everything looks blurry"

👂 "I can't hear properly"

🦷 "My gums are swollen"

🦴 "My knee hurts when I walk"

🧠 "My hand feels numb"

👩 "My periods are irregular"

👶 "My child has fever"

🚻 "It burns when I pee"

🫁 "I get breathless when walking"

You can also ask me about doctors, appointments, patients, admissions, pharmacy, laboratory or billing.`;
    };

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = () => {
        if (!message.trim()) {
            return;
        }

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        setTimeout(() => {
            const reply = getBotReply(userMessage);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text: reply
                }
            ]);
        }, 400);
    };

    // =========================================================
    // ENTER KEY
    // =========================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            <button
                className="chatbot-button"
                onClick={() => setOpen(!open)}
            >
                💬
            </button>

            {open && (
                <div className="chatbot-window">

                    {/* HEADER */}

                    <div className="chatbot-header">

                        <div>
                            <strong>
                                AarogyaCare Assistant
                            </strong>

                            <span>
                                🏥 Hospital Support
                            </span>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                    </div>

                    {/* MESSAGES */}

                    <div className="chatbot-messages">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "chat-message user"
                                        : "chat-message bot"
                                }
                            >
                                <div>

                                    {msg.text
                                        .split("\n")
                                        .map((line, i) => (
                                            <React.Fragment
                                                key={i}
                                            >
                                                {line}

                                                {i <
                                                    msg.text.split(
                                                        "\n"
                                                    ).length -
                                                        1 && (
                                                    <br />
                                                )}
                                            </React.Fragment>
                                        ))}

                                </div>
                            </div>
                        ))}

                    </div>

                    {/* INPUT */}

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Ask about symptoms, doctors..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            onClick={sendMessage}
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