
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const menuItems = [
        { path: "/", icon: "🏠", label: "Dashboard" },
        { path: "/departments", icon: "🏥", label: "Departments" },
        { path: "/doctors", icon: "👨‍⚕️", label: "Doctors" },
        { path: "/staff", icon: "👨‍💼", label: "Staff" },
        { path: "/patients", icon: "👤", label: "Patients" },
        { path: "/appointments", icon: "📅", label: "Appointments" },
        { path: "/admissions", icon: "🛏️", label: "Admissions" },
        { path: "/pharmacy", icon: "💊", label: "Pharmacy" },
        { path: "/laboratory", icon: "🧪", label: "Laboratory" },
        { path: "/billing", icon: "💰", label: "Billing" },
        { path: "/inventory", icon: "📦", label: "Inventory" },
        { path: "/reports", icon: "📊", label: "Reports" },
    ];

    return (
        <aside className="sidebar">

            {/* HOSPITAL BRAND */}
            <div className="sidebar-brand">
                <div className="hospital-logo">🏥</div>

                <div className="hospital-name">
                    <h2>AarogyaCare</h2>
                    <span>Hospital Management</span>
                </div>
            </div>

            {/* MENU TITLE */}
            <div className="sidebar-section-title">
                MAIN MENU
            </div>

            {/* MENU */}
            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                            `menu-item ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="menu-icon">
                            {item.icon}
                        </span>

                        <span className="menu-label">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* SIDEBAR FOOTER */}
            <div className="sidebar-footer">
                <div className="status-dot"></div>

                <div>
                    <strong>System Online</strong>
                    <span>All services operational</span>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;
