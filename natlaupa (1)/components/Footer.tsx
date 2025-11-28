import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full py-20 px-4 md:px-8 bg-black text-white overflow-hidden border-t border-white/5">
        
        {/* Decorative Corner Image */}
        <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
             <svg 
                width="600" 
                height="400" 
                viewBox="0 0 600 400" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="block w-[250px] md:w-[500px] h-auto text-softGold fill-current opacity-80"
             >
                <path d="M600 400V100C500 200 420 280 280 300C140 320 0 400 0 400H600Z" />
             </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20 items-start">
                
                {/* Col 1: Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-white/90 mb-4">Natlaupa Collection</h3>
                        <div className="w-10 h-[1px] bg-gold mb-6"></div>
                    </div>
                    <div className="font-serif text-lg leading-relaxed text-slate-200">
                        <p>101 Luxury Lane, Suite 500</p>
                        <p>Beverly Hills, CA 90210</p>
                    </div>
                    <div className="font-sans text-xs uppercase tracking-widest text-slate-400 space-y-2">
                        <p>Tel: +1 (800) 555-0199</p>
                        <p>
                           <a href="mailto:concierge@natlaupa.com" className="hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5">
                             concierge@natlaupa.com
                           </a>
                        </p>
                    </div>
                    <div className="flex space-x-6 pt-4 text-white/60">
                         <Instagram size={18} className="hover:text-gold cursor-pointer transition-colors" />
                         <Facebook size={18} className="hover:text-gold cursor-pointer transition-colors" />
                         <Twitter size={18} className="hover:text-gold cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Col 2: Navigation (Centered Text Style) */}
                <div className="flex flex-col items-start md:items-center space-y-5 pt-4">
                    <Link to="/" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">Home</Link>
                    <Link to="/offers" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">The Collection</Link>
                    <Link to="/destinations" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">Destinations</Link>
                    <Link to="/styles" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">Styles</Link>
                    <Link to="/for-hotels" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">For Hotels</Link>
                    <Link to="/become-angel" className="font-serif text-2xl italic text-slate-300 hover:text-white transition-colors">Angel Program</Link>
                </div>

                {/* Col 3: Newsletter (Form Style) */}
                <div className="space-y-6">
                    <h3 className="font-serif text-3xl italic text-white">Subscribe to Newsletter</h3>
                    
                    <form className="space-y-6 mt-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2 group-focus-within:text-gold transition-colors">Email*</label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-transparent border-b border-white/30 py-2 text-white font-serif italic text-lg focus:outline-none focus:border-gold transition-colors placeholder-transparent"
                            />
                        </div>
                        
                        <div className="space-y-3">
                             <div className="flex flex-col space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Privacy Policy</p>
                                <Link to="#" className="text-[10px] text-slate-500 font-light hover:text-gold transition-colors">Click here to read our privacy policy.</Link>
                             </div>
                             
                             <label className="flex items-start space-x-3 cursor-pointer mt-2 group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none border border-white/30 bg-transparent transition-all checked:border-gold checked:bg-gold" />
                                    <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-[10px] text-slate-400 leading-tight group-hover:text-white transition-colors pt-0.5">
                                    I have read the Privacy policy and I give my consent to the processing of my personal data.
                                </span>
                             </label>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    <Link to="#" className="hover:text-white transition-colors">Credits</Link>
                </div>
                <p>Copyright © 2024 Natlaupa - All Rights Reserved.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;