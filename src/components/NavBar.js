import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <div>
                <p><Link className="link" to="/">Home</Link></p>
            </div>
            <div>
                <ul>
                    <li><Link className="link" to="/detect">Detect</Link></li>
                    <li><Link className="link" to="/">Detected</Link></li>
                </ul>
            </div>
            <div>
                <p><Link className="link" to="/">User</Link></p>
            </div>
        </nav>
    );
}

export default NavBar;