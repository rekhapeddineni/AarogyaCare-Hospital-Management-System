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
        fetch(`${API_URL}/doctors/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Doctor API failed");
                }

                return response.json();
            })
            .then((data) => {
                console.log("Doctors from database:", data);

                if (Array.isArray(data)) {
                    setDoctors(data);
                } else if (Array.isArray(data.results)) {
                    setDoctors(data.results);
                } else {
                    setDoctors([]);
                }
            })
            .catch((error) => {
                console.error("Doctor loading error:", error);
                setDoctors([]);
            });
    }, []);

    // =========================================================
    // DEPARTMENT INFORMATION
    // =========================================================

    const departmentInfo = {
        "General Medicine": {
            description:
                "General health problems, fever, infections, stomach problems, weakness and common illnesses."
        },

        Cardiology: {
            description:
                "Heart and cardiovascular problems such as chest discomfort, palpitations and blood-pressure-related concerns."
        },

        Dermatology: {
            description:
                "Skin, hair and nail problems including rashes, itching, acne, infections and hair loss."
        },

        Ophthalmology: {
            description:
                "Eye and vision problems including blurred vision, eye pain, redness and infections."
        },

        ENT: {
            description:
                "Ear, nose and throat problems including ear pain, hearing problems, sinus issues and sore throat."
        },

        Dentistry: {
            description:
                "Teeth, gums and mouth problems including toothache, cavities, gum swelling and dental infections."
        },

        Orthopedics: {
            description:
                "Bones, joints, muscles and movement problems including back pain, knee pain, fractures and injuries."
        },

        Neurology: {
            description:
                "Brain, nerves and neurological problems including numbness, seizures, tremors, dizziness and memory problems."
        },

        Gynecology: {
            description:
                "Women's reproductive and gynecological concerns including period problems, pregnancy-related concerns and pelvic problems."
        },

        Pediatrics: {
            description:
                "Healthcare for babies, children and adolescents."
        },

        Urology: {
            description:
                "Urinary system and kidney-related problems including burning urination, kidney stones and urinary infections."
        },

        Pulmonology: {
            description:
                "Lung and breathing problems including asthma, wheezing, persistent cough and breathing difficulty."
        }
    };

    // =========================================================
    // SYMPTOM KEYWORDS
    // =========================================================

    const departmentKeywords = {
        "General Medicine": [
            "fever",
            "temperature",
            "cold",
            "cough",
            "sneeze",
            "sneezing",
            "runny nose",
            "blocked nose",
            "headache",
            "head pain",
            "body pain",
            "body ache",
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
            "gastric problem",
            "acidity",
            "acid reflux",
            "heartburn",
            "indigestion",
            "stomach",
            "stomach pain",
            "stomach ache",
            "belly pain",
            "abdominal",
            "appetite",
            "loss of appetite",
            "infection",
            "viral infection",
            "flu",
            "sugar",
            "diabetes",
            "diabetic",
            "blood pressure",
            "bp",
            "high bp",
            "low bp",
            "hypertension",
            "cholesterol"
        ],

        Cardiology: [
            "heart",
            "heart problem",
            "heart issue",
            "heart disease",
            "heart condition",
            "heart pain",
            "heart hurts",
            "heart beating",
            "heartbeat",
            "heart beat",
            "fast heartbeat",
            "fast heart beat",
            "heart beating fast",
            "heart is beating fast",
            "heart racing",
            "racing heart",
            "palpitation",
            "palpitations",
            "irregular heartbeat",
            "irregular heart beat",
            "pounding heart",
            "heart pounding",
            "chest pain",
            "chest hurts",
            "chest discomfort",
            "chest pressure",
            "pressure in chest",
            "chest tightness",
            "tightness in chest",
            "chest heaviness",
            "heavy chest",
            "pain near heart",
            "pain around heart",
            "pain in heart area",
            "cardiac",
            "cardiovascular",
            "breathless with chest pain",
            "dizziness with chest pain"
        ],

        Dermatology: [
            "skin",
            "skin problem",
            "skin issue",
            "skin disease",
            "skin infection",
            "skin rash",
            "rash",
            "rashes",
            "red rash",
            "redness",
            "skin redness",
            "itch",
            "itching",
            "itchy",
            "itchy skin",
            "skin is itchy",
            "skin very itchy",
            "acne",
            "pimple",
            "pimples",
            "pimples on face",
            "face pimples",
            "breakouts",
            "blackheads",
            "whiteheads",
            "eczema",
            "psoriasis",
            "dry skin",
            "very dry skin",
            "oily skin",
            "skin allergy",
            "skin irritation",
            "skin burning",
            "burning skin",
            "skin swelling",
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
            "boils",
            "skin ulcer"
        ],

        Ophthalmology: [
            "eye",
            "eyes",
            "eye problem",
            "eye issue",
            "eye pain",
            "eyes hurt",
            "my eye hurts",
            "my eyes hurt",
            "pain in eye",
            "pain in eyes",
            "vision",
            "vision problem",
            "vision issue",
            "eyesight",
            "eyesight problem",
            "weak eyesight",
            "blurred vision",
            "blurry vision",
            "can't see",
            "cannot see",
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
            "eye pus",
            "double vision",
            "seeing double",
            "eye strain",
            "sensitivity to light",
            "light hurts my eyes",
            "flashing lights",
            "floaters"
        ],

        ENT: [
            "ear",
            "ears",
            "ear problem",
            "ear issue",
            "ear pain",
            "ear hurts",
            "my ear hurts",
            "pain in ear",
            "ear infection",
            "ear blockage",
            "blocked ear",
            "hearing",
            "hearing problem",
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
            "throat",
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
            "nose",
            "nose problem",
            "nose issue",
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
            "jaw pain",
            "jaw problem"
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
            "stiff joint",
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
            "back",
            "back pain",
            "my back hurts",
            "lower back pain",
            "upper back pain",
            "back injury",
            "neck",
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
            "difficulty moving",
            "movement problem"
        ],

        Neurology: [
            "brain",
            "brain problem",
            "brain issue",
            "nerve",
            "nerves",
            "nerve problem",
            "nerve pain",
            "neurological",
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
            "nerve weakness",
            "one side weakness",
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
            "heavy bleeding",
            "menstrual",
            "menstrual problem",
            "menstrual pain",
            "pregnancy",
            "pregnant",
            "pregnancy problem",
            "pregnancy issue",
            "pregnancy related",
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
            "fertility",
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
            "child fever",
            "baby fever",
            "fever in child",
            "fever in baby",
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
            "poor appetite in child",
            "not eating",
            "child not eating",
            "baby not eating",
            "child breathing problem",
            "baby breathing problem"
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
            "mucus in chest",
            "lung pain"
        ]
    };

    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // =========================================================
    // EMERGENCY CHECK
    // =========================================================

    const emergencyKeywords = [
        "severe chest pain",
        "crushing chest pain",
        "heavy chest pain",
        "chest pain and sweating",
        "chest pain and vomiting",
        "chest pain and fainting",
        "can't breathe",
        "cannot breathe",
        "unable to breathe",
        "severe breathing difficulty",
        "not breathing",
        "unconscious",
        "unresponsive",
        "stroke",
        "face drooping",
        "one side of body weak",
        "one side weakness",
        "sudden paralysis",
        "sudden loss of vision",
        "heavy bleeding",
        "uncontrolled bleeding",
        "severe bleeding",
        "severe allergic reaction",
        "anaphylaxis",
        "poisoning",
        "overdose",
        "severe seizure",
        "continuous seizure"
    ];

    const isEmergency = (text) => {
        const normalized = normalizeText(text);

        return emergencyKeywords.some((keyword) =>
            normalized.includes(keyword)
        );
    };

    // =========================================================
    // DIRECT DEPARTMENT NAME DETECTION
    // =========================================================

    const getDirectDepartment = (text) => {
        const normalized = normalizeText(text);

        const aliases = {
            "General Medicine": [
                "general medicine",
                "general doctor",
                "general physician",
                "physician"
            ],

            Cardiology: [
                "cardiology",
                "cardiologist",
                "heart doctor",
                "heart specialist"
            ],

            Dermatology: [
                "dermatology",
                "dermatologist",
                "skin doctor",
                "skin specialist"
            ],

            Ophthalmology: [
                "ophthalmology",
                "ophthalmologist",
                "eye doctor",
                "eye specialist"
            ],

            ENT: [
                "ent",
                "ent doctor",
                "ent specialist",
                "ear doctor",
                "throat doctor"
            ],

            Dentistry: [
                "dentistry",
                "dentist",
                "dental doctor",
                "dental specialist"
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
                "child doctor",
                "children doctor",
                "baby doctor"
            ],

            Urology: [
                "urology",
                "urologist",
                "urine doctor",
                "kidney doctor"
            ],

            Pulmonology: [
                "pulmonology",
                "pulmonologist",
                "lung doctor",
                "lung specialist"
            ]
        };

        for (const department in aliases) {
            for (const alias of aliases[department]) {
                if (normalized === alias || normalized.includes(alias)) {
                    return department;
                }
            }
        }

        return null;
    };

    // =========================================================
    // SCORE EACH DEPARTMENT
    // =========================================================

    const findDepartment = (text) => {
        const normalized = normalizeText(text);

        // Direct department request gets priority.
        const directDepartment = getDirectDepartment(normalized);

        if (directDepartment) {
            return directDepartment;
        }

        const scores = {};

        Object.keys(departmentKeywords).forEach((department) => {
            scores[department] = 0;
        });

        // -----------------------------------------------------
        // MATCH KEYWORDS
        // -----------------------------------------------------

        Object.entries(departmentKeywords).forEach(
            ([department, keywords]) => {
                keywords.forEach((keyword) => {
                    const cleanKeyword = normalizeText(keyword);

                    if (normalized.includes(cleanKeyword)) {
                        // Longer phrases receive more weight.
                        if (cleanKeyword.includes(" ")) {
                            scores[department] += 3;
                        } else {
                            scores[department] += 1;
                        }
                    }
                });
            }
        );

        // -----------------------------------------------------
        // SPECIAL COMBINATION RULES
        // -----------------------------------------------------

        // Child/baby symptoms should strongly favor Pediatrics.
        if (
            normalized.includes("child") ||
            normalized.includes("baby") ||
            normalized.includes("kid") ||
            normalized.includes("infant") ||
            normalized.includes("children")
        ) {
            scores["Pediatrics"] += 8;
        }

        // Heart-related combinations.
        if (
            normalized.includes("chest") &&
            (
                normalized.includes("pain") ||
                normalized.includes("pressure") ||
                normalized.includes("tight") ||
                normalized.includes("heavy")
            )
        ) {
            scores["Cardiology"] += 8;
        }

        // Breathing-related problems.
        if (
            normalized.includes("breathing") ||
            normalized.includes("breathless") ||
            normalized.includes("shortness of breath") ||
            normalized.includes("wheezing")
        ) {
            scores["Pulmonology"] += 6;
        }

        // Skin combinations.
        if (
            normalized.includes("skin") &&
            (
                normalized.includes("itch") ||
                normalized.includes("rash") ||
                normalized.includes("red") ||
                normalized.includes("infection") ||
                normalized.includes("pimple") ||
                normalized.includes("dry")
            )
        ) {
            scores["Dermatology"] += 8;
        }

        // Eye combinations.
        if (
            (
                normalized.includes("eye") ||
                normalized.includes("eyes")
            ) &&
            (
                normalized.includes("pain") ||
                normalized.includes("red") ||
                normalized.includes("blur") ||
                normalized.includes("vision") ||
                normalized.includes("itch") ||
                normalized.includes("water")
            )
        ) {
            scores["Ophthalmology"] += 8;
        }

        // Urinary combinations.
        if (
            (
                normalized.includes("urine") ||
                normalized.includes("urinary") ||
                normalized.includes("urinating")
            ) &&
            (
                normalized.includes("pain") ||
                normalized.includes("burn") ||
                normalized.includes("blood") ||
                normalized.includes("frequent")
            )
        ) {
            scores["Urology"] += 8;
        }

        // Dental combinations.
        if (
            (
                normalized.includes("tooth") ||
                normalized.includes("teeth") ||
                normalized.includes("gum") ||
                normalized.includes("dental")
            ) &&
            (
                normalized.includes("pain") ||
                normalized.includes("hurt") ||
                normalized.includes("bleed") ||
                normalized.includes("swollen")
            )
        ) {
            scores["Dentistry"] += 8;
        }

        // Bone/joint combinations.
        if (
            (
                normalized.includes("knee") ||
                normalized.includes("shoulder") ||
                normalized.includes("back") ||
                normalized.includes("joint") ||
                normalized.includes("bone") ||
                normalized.includes("fracture")
            )
        ) {
            scores["Orthopedics"] += 6;
        }

        // Neurological combinations.
        if (
            normalized.includes("numb") ||
            normalized.includes("tingling") ||
            normalized.includes("seizure") ||
            normalized.includes("tremor") ||
            normalized.includes("memory")
        ) {
            scores["Neurology"] += 6;
        }

        // Gynecology combinations.
        if (
            normalized.includes("period") ||
            normalized.includes("pregnan") ||
            normalized.includes("ovary") ||
            normalized.includes("pelvic") ||
            normalized.includes("pcos") ||
            normalized.includes("pcod")
        ) {
            scores["Gynecology"] += 8;
        }

        // -----------------------------------------------------
        // FIND HIGHEST SCORE
        // -----------------------------------------------------

        let bestDepartment = null;
        let bestScore = 0;

        Object.entries(scores).forEach(([department, score]) => {
            if (score > bestScore) {
                bestScore = score;
                bestDepartment = department;
            }
        });

        return bestDepartment;
    };

    // =========================================================
    // FIND DOCTOR FROM ACTUAL DATABASE
    // =========================================================

    const findDoctorForDepartment = (department) => {
        if (!doctors || doctors.length === 0) {
            return null;
        }

        const departmentName = department.toLowerCase();

        // First try specialization.
        let doctor = doctors.find((item) => {
            const specialization = normalizeText(
                item.specialization || ""
            );

            const dbDepartment = normalizeText(
                item.department || ""
            );

            if (departmentName === "dermatology") {
                return (
                    specialization.includes("dermatolog") ||
                    dbDepartment.includes("dermatolog")
                );
            }

            if (departmentName === "cardiology") {
                return (
                    specialization.includes("cardiolog") ||
                    dbDepartment.includes("cardiolog")
                );
            }

            if (departmentName === "neurology") {
                return (
                    specialization.includes("neurolog") ||
                    dbDepartment.includes("neurolog") ||
                    specialization.includes("neurosurgeon") ||
                    dbDepartment.includes("neurosurgeon")
                );
            }

            if (departmentName === "orthopedics") {
                return (
                    specialization.includes("orthopedic") ||
                    specialization.includes("orthopaedic") ||
                    dbDepartment.includes("orthopedic") ||
                    dbDepartment.includes("orthopaedic")
                );
            }

            if (departmentName === "ophthalmology") {
                return (
                    specialization.includes("ophthalm") ||
                    dbDepartment.includes("ophthalm") ||
                    specialization.includes("eye") ||
                    dbDepartment.includes("eye")
                );
            }

            if (departmentName === "ent") {
                return (
                    specialization.includes("ent") ||
                    dbDepartment.includes("ent") ||
                    specialization.includes("otolaryng")
                );
            }

            if (departmentName === "dentistry") {
                return (
                    specialization.includes("dent") ||
                    dbDepartment.includes("dent")
                );
            }

            if (departmentName === "gynecology") {
                return (
                    specialization.includes("gynec") ||
                    specialization.includes("gynaec") ||
                    dbDepartment.includes("gynec") ||
                    dbDepartment.includes("gynaec")
                );
            }

            if (departmentName === "pediatrics") {
                return (
                    specialization.includes("pediatric") ||
                    specialization.includes("paediatric") ||
                    dbDepartment.includes("pediatric") ||
                    dbDepartment.includes("paediatric")
                );
            }

            if (departmentName === "urology") {
                return (
                    specialization.includes("urolog") ||
                    dbDepartment.includes("urolog")
                );
            }

            if (departmentName === "pulmonology") {
                return (
                    specialization.includes("pulmon") ||
                    specialization.includes("respir") ||
                    dbDepartment.includes("pulmon") ||
                    dbDepartment.includes("respir")
                );
            }

            if (departmentName === "general medicine") {
                return (
                    specialization.includes("general") ||
                    specialization.includes("physician") ||
                    dbDepartment.includes("general") ||
                    dbDepartment.includes("medicine")
                );
            }

            return (
                specialization.includes(departmentName) ||
                dbDepartment.includes(departmentName)
            );
        });

        return doctor || null;
    };

    // =========================================================
    // DOCTOR RESPONSE
    // =========================================================

    const createDepartmentReply = (department) => {
        const doctor = findDoctorForDepartment(department);

        let reply = `🏥 Department: ${department}

${departmentInfo[department].description}`;

        if (doctor) {
            reply += `

👨‍⚕️ Doctor:
${doctor.doctor_name || "Doctor available"}

🩺 Specialization:
${doctor.specialization || "Not specified"}`;

            if (doctor.experience !== undefined) {
                reply += `

Experience:
${doctor.experience} years`;
            }
        } else {
            reply += `

👨‍⚕️ Doctor:
No doctor is currently registered for this department in the Doctors module.`;
        }

        reply += `

Please consult a qualified doctor for proper evaluation and treatment.`;

        return reply;
    };

    // =========================================================
    // ALL DOCTORS
    // =========================================================

    const getDoctorsReply = () => {
        if (!doctors || doctors.length === 0) {
            return `👨‍⚕️ Doctors

No doctors are currently available in the database.`;
        }

        let reply = "👨‍⚕️ Doctors Available in AarogyaCare\n\n";

        doctors.forEach((doctor, index) => {
            reply += `${index + 1}. ${
                doctor.doctor_name || "Doctor"
            }

Specialization: ${
                doctor.specialization || "Not specified"
            }

Department: ${
                doctor.department || "Not specified"
            }

Experience: ${
                doctor.experience !== undefined
                    ? `${doctor.experience} years`
                    : "Not specified"
            }

`;
        });

        return reply;
    };

    // =========================================================
    // EMERGENCY RESPONSE
    // =========================================================

    const emergencyReply = () => {
        return `🚨 EMERGENCY

Your message may describe a potentially serious medical situation.

Please seek emergency medical care immediately or contact your local emergency service.

Do not wait for a chatbot response if symptoms are severe, sudden, or getting worse.

🏥 If you are already at the hospital, please inform the emergency/medical staff immediately.`;
    };

    // =========================================================
    // MAIN BOT LOGIC
    // =========================================================

    const getBotReply = (userMessage) => {
        const text = normalizeText(userMessage);

        // -----------------------------------------------------
        // EMERGENCY FIRST
        // -----------------------------------------------------

        if (isEmergency(text)) {
            return emergencyReply();
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

You can:
🩺 Describe your symptoms
👨‍⚕️ Ask about doctors
🏥 Ask about departments
📅 Ask about appointments
💊 Ask about pharmacy
🧪 Ask about laboratory
💳 Ask about billing

For example:
"My skin is very itchy"
"My chest hurts"
"My knee is painful"`;
        }

        // -----------------------------------------------------
        // DOCTOR LIST
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
        // DEPARTMENT LIST
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

You can type a department name or simply describe your symptoms.`;
        }

        // -----------------------------------------------------
        // APPOINTMENT
        // -----------------------------------------------------

        if (
            text.includes("appointment") ||
            text.includes("book doctor") ||
            text.includes("book an appointment") ||
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
        // THANK YOU
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
        // FIND DEPARTMENT FROM SYMPTOMS
        // -----------------------------------------------------

        const department = findDepartment(text);

        if (department) {
            return createDepartmentReply(department);
        }

        // -----------------------------------------------------
        // UNKNOWN MESSAGE
        // -----------------------------------------------------

        return `I couldn't confidently identify the appropriate department from that description.

You can describe the problem in your own words.

For example:

🩺 "I have a painful rash on my skin"

❤️ "My heart is beating very fast"

👁️ "My vision is blurry"

🦷 "My tooth hurts when I eat"

🦴 "My knee hurts when I walk"

🧠 "My hand feels numb"

👂 "I can't hear properly"

🫁 "I get breathless easily"

🚻 "It burns when I urinate"

👩 "My periods are irregular"

👶 "My child has fever"

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
                <div className="chatbot-container">

                    {/* HEADER */}

                    <div className="chatbot-header">

                        <div>
                            <strong>AarogyaCare Assistant</strong>
                            <span>🏥 Hospital Support</span>
                        </div>

                        <button
                            className="chatbot-close"
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
                                        ? "message user-message"
                                        : "message bot-message"
                                }
                            >
                                <div className="message-text">

                                    {msg.text
                                        .split("\n")
                                        .map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}

                                                {i <
                                                    msg.text.split("\n")
                                                        .length -
                                                        1 && <br />}
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

                        <button onClick={sendMessage}>
                            ➤
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default Chatbot;