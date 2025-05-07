function MinimalFooterComponent(props) {
    return (
        <footer className="footer sm:footer-horizontal footer-center bg-neutral/90 text-white p-4">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
            </aside>
        </footer>
    );
}

export default MinimalFooterComponent;