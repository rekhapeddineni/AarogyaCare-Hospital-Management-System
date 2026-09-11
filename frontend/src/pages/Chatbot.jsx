
import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 Welcome to AarogyaCare Hospital. How can I help you?",
        },
    ]);

    const getReply = (text) => {
        const message = text.toLowerCase();

        if (message.includes("doctor")) {
            return "You can manage doctors from the Doctors module in the sidebar.";
        }

        if (message.includes("patient")) {
            return "You can manage patient records from the Patients module.";
        }

        if (message.includes("appointment")) {
            return "You can schedule and manage appointments from the Appointments module.";
        }

        if (message.includes("admission")) {
            return "You can manage hospital admissions from the Admissions module.";
        }

        if (message.includes("pharmacy")) {
            return "You can manage medicines and pharmacy records from the Pharmacy module.";
        }

        if (
            message.includes("laboratory") ||
            message.includes("lab")
        ) {
            return "You can manage laboratory tests and reports from the Laboratory module.";
        }

        if (message.includes("billing")) {
            return "You can manage bills and payment records from the Billing module.";
        }

        if (
            message.includes("hello") ||
            message.includes("hi") ||
            message.includes("hey")
        ) {
            return "Hello! 👋 How can I help you today?";
        }

        if (message.includes("help")) {
            return "I can help you with Doctors, Patients, Appointments, Admissions, Pharmacy, Laboratory and Billing.";
        }

        return "I'm here to help with the AarogyaCare Hospital Management System. Try asking about patients, doctors, appointments or admissions.";
    };

    const sendMessage = () => {
        const text = input.trim();

        if (!text) {
            return;
        }

        const botReply = getReply(text);

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: text,
            },
            {
                sender: "bot",
                text: botReply,
            },
        ]);

        setInput("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            {/* CHAT BUTTON */}

            <button
                className="chatbot-button"
                onClick={() => setIsOpen(!isOpen)}
                title="AarogyaCare Assistant"
            >
                {isOpen ? "✕" : "💬"}
            </button>


            {/* CHAT WINDOW */}

            {isOpen && (
                <div className="chatbot-window">

                    {/* HEADER */}

                    <div className="chatbot-header">

                        <div className="chatbot-title">

                            <div className="chatbot-avatar">
                                🤖
                            </div>

                            <div>
                                <h3>
                                    AarogyaCare Assistant
                                </h3>

                                <span>
                                    <i></i>
                                    Online
                                </span>
                            </div>

                        </div>

                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>

                    </div>


                    {/* MESSAGES */}

                    <div className="chatbot-messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`chat-message ${message.sender}`}
                            >

                                {message.sender === "bot" && (
                                    <div className="message-avatar">
                                        🤖
                                    </div>
                                )}

                                <div className="message-bubble">
                                    {message.text}
                                </div>

                            </div>

                        ))}

                    </div>


                    {/* INPUT */}

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            onClick={sendMessage}
                            title="Send message"
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

