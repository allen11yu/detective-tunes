import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <div>
                <ul>
                    <li><Link className="link" to="/">Detect</Link></li>
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