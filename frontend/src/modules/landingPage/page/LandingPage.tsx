import Navbar from "../components/Navbar";
import Index from "../components/Index";
import FuncionalitySection from "../components/FuncionalitySection";
import TestimonySection from "../components/TestimonySection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
const LandingPage = () => {

    return (
        <div >
            <Navbar/>
            <Index/>
            <FuncionalitySection/>
            <TestimonySection/>
            <ContactSection/>
            <Footer/>
        </div>
    );
};

export default LandingPage;