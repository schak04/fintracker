export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p className="footer-text">
                        © {year} FinTracker. Made by <span className="author-name">Saptaparno Chakraborty</span>
                    </p>
                    <div className="footer-links">
                        <span className="footer-version">v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}