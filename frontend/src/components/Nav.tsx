import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Resumes" },
  { to: "/analyze", label: "Analyze" },
  { to: "/applications", label: "Applications" },
  { to: "/assistant", label: "Assistant" },
];

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-brand">Job Search Assistant</div>
      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
