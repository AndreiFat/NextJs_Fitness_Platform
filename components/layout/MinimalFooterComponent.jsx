function MinimalFooterComponent(props) {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-primary text-white p-4">
            <aside>
                © {new Date().getFullYear()} FitMind — Toate drepturile rezervate.
            </aside>
        </footer>
    );
}

export default MinimalFooterComponent;