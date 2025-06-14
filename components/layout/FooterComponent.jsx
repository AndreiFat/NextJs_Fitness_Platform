import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faInstagram, faTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";

function FooterComponent(props) {
    return (
        <footer className="bg-secondary-content text-neutral-content py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {/* Brand + descriere */}
                <aside>
                    <a className="" href={"/"}><img src="/assets/logo.png" className={"h-[36px] mb-4"}
                                                    alt=""/></a>
                    <p className="text-sm text-neutral-content/70 leading-relaxed">
                        Platforma ta inteligentă pentru fitness, nutriție și progres personal. Alimentat de AI, inspirat
                        de rezultate.
                    </p>
                </aside>

                {/* Navigație */}
                <nav>
                    <h3 className="footer-title text-base-content mb-2">Navigație</h3>
                    <ul className="space-y-1 text-sm text-neutral-content/80">
                        <li><a className="link link-hover" href={"/"}>Acasă</a></li>
                        <li><a className="link link-hover" href={"/shop"}>Produse</a></li>
                        <li><a className="link link-hover" href={"/fitness"}>AI Coach</a></li>
                        {/*<li><a className="link link-hover">Contact</a></li>*/}
                    </ul>
                </nav>

                {/*/!* Resurse *!/*/}
                {/*<nav>*/}
                {/*    <h3 className="footer-title text-base-content mb-2">Resurse</h3>*/}
                {/*    <ul className="space-y-1 text-sm text-neutral-content/80">*/}
                {/*        <li><a className="link link-hover">Blog</a></li>*/}
                {/*        <li><a className="link link-hover">Ghiduri</a></li>*/}
                {/*        <li><a className="link link-hover">FAQ</a></li>*/}
                {/*        <li><a className="link link-hover">Termeni & Politici</a></li>*/}
                {/*    </ul>*/}
                {/*</nav>*/}

                {/* Social media */}
                <nav>
                    <h3 className="footer-title text-base-content mb-2">Urmărește-ne</h3>
                    <div className="flex gap-4 mt-2 text-white text-xl">
                        <a href="#" aria-label="Twitter" className="hover:text-accent transition">
                            <FontAwesomeIcon icon={faTwitter}/>
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-accent transition">
                            <FontAwesomeIcon icon={faInstagram}/>
                        </a>
                        <a href="#" aria-label="Facebook" className="hover:text-accent transition">
                            <FontAwesomeIcon icon={faFacebookF}/>
                        </a>
                        <a href="#" aria-label="YouTube" className="hover:text-accent transition">
                            <FontAwesomeIcon icon={faYoutube}/>
                        </a>
                    </div>
                </nav>
            </div>

        </footer>
    );
}

export default FooterComponent;