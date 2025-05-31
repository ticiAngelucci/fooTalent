import { useState } from "react"
import { ModalLegal } from "./Modal"
const legalContent = {
    privacy: {
        title: "Política de privacidad",
        subtitle:
            "En Rentary, nos comprometemos a proteger tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.",
        items: [
            "Datos personales: nombre, email, teléfono, dirección.",
            "Información de propiedad o alquiler.",
            "Información de pagos (si se procesan transacciones).",
            "Datos de uso del sitio (cookies, dirección IP, etc.).",
            "Utilizamos tu información para: Gestionar tu cuenta, mejorar nuestra plataforma, enviarte notificaciones importantes.",
            "No compartimos tu información personal con terceros, salvo en casos específicos.",
            "Implementamos medidas de seguridad razonables.",
            "Podés acceder, corregir o eliminar tu información personal en cualquier momento."
        ]
    },
    terms: {
        title: "Términos de servicio",
        subtitle:
            "Bienvenido a Rentary. Al acceder y utilizar nuestra plataforma, aceptás cumplir con los siguientes Términos de Servicio.",
        items: [
            "Uso de la plataforma: gestión de alquileres, pagos y contratos.",
            "Registro y cuentas: sos responsable de tu contraseña y actividad.",
            "Responsabilidades del usuario: uso legal, sin contenido ilegal o fraudulento.",
            "Propiedad intelectual: todo el contenido pertenece a Rentary o sus licenciantes.",
            "Limitación de responsabilidad: no nos hacemos responsables por errores o fallos técnicos.",
            "Modificaciones: podemos actualizar estos términos en cualquier momento.",
            "Jurisdicción: se rige por las leyes de Argentina."
        ]
    },
    cookies: {
        title: "Política de cookies",
        subtitle: "Esta política explica qué son las cookies y cómo las usamos en Rentary.",
        items: [
            "Las cookies son pequeños archivos que se almacenan en tu dispositivo.",
            "Cookies esenciales: necesarias para el funcionamiento básico.",
            "Cookies de análisis: nos ayudan a mejorar la plataforma.",
            "Cookies funcionales: recuerdan tus preferencias.",
            "Podés configurar tu navegador para rechazar o eliminar cookies."
        ]
    }
}
const Footer = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [currentContent, setCurrentContent] = useState(legalContent.privacy)

    const handleOpen = (type: keyof typeof legalContent) => {
        setCurrentContent(legalContent[type])
        setModalOpen(true)
    }
    return (
        <>
            <footer className="bg-[#1E3DB2] text-white px-6 md:px-12 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">

                    <div className="flex items-center gap-2">
                        <a href="#inicio" className="!text-white !font-bold">
                            <svg width="192" height="38" viewBox="0 0 192 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.8136 36.0594C25.8136 36.4824 25.668 36.8041 25.409 36.9537C25.15 37.1032 24.7986 37.0684 24.4323 36.8569L2.33195 24.0973C1.96562 23.8858 1.61429 23.5149 1.35525 23.0662C1.09621 22.6176 0.950684 22.1279 0.950684 21.7048V4.94187C0.950538 4.69874 0.998499 4.48655 1.0909 4.32153C1.18331 4.1565 1.31772 4.043 1.48385 3.98969L12.534 0.444101C12.7765 0.366294 13.0749 0.420344 13.3821 0.597704C13.6893 0.775064 13.9877 1.06561 14.2302 1.4234L25.2804 17.7286C25.4465 17.9738 25.5809 18.2425 25.6733 18.5142C25.7657 18.7859 25.8137 19.0535 25.8136 19.2965V36.0594Z" fill="#EFF6FF" />
                                <path d="M29.7801 0.44302C30.0225 0.365431 30.3211 0.420374 30.6281 0.59762C30.9352 0.775002 31.2338 1.06528 31.4762 1.42291L42.5256 17.7276C42.6916 17.9726 42.8265 18.2416 42.9189 18.5131C43.0113 18.7848 43.06 19.0534 43.0599 19.2963V36.0591C43.0598 36.4817 42.9138 36.803 42.6552 36.9526C42.3961 37.1022 42.0439 37.0675 41.6775 36.856L31.2545 30.838V19.1588C31.2547 18.8347 31.1912 18.4777 31.0681 18.1152C30.9449 17.7528 30.7654 17.3941 30.544 17.0671L21.1577 3.20878L29.7801 0.44302Z" fill="#EFF6FF" />
                                <path d="M47.0257 0.443338C47.2682 0.365607 47.5666 0.419481 47.8737 0.596801C48.1808 0.774181 48.4794 1.06445 48.7218 1.4221L59.7712 17.7268C59.9373 17.9719 60.0721 18.2417 60.1645 18.5134C60.2568 18.785 60.3056 19.0527 60.3055 19.2955V36.0583C60.3054 36.4809 60.1594 36.8022 59.9008 36.9518C59.6417 37.1014 59.2895 37.0667 58.9231 36.8552L48.5001 30.8371V19.158C48.5003 18.8339 48.4368 18.4768 48.3137 18.1144C48.1905 17.752 48.011 17.3933 47.7896 17.0663L38.4033 3.2091L47.0257 0.443338Z" fill="#EFF6FF" />
                                <path d="M69.0298 26.989V5.00244H79.5793C82.1057 5.00244 83.9606 5.67387 85.1442 7.01674C86.3277 8.33685 86.9195 10.1235 86.9195 12.3768C86.9195 13.8563 86.5326 15.1308 85.7587 16.2006C85.0076 17.2703 83.9379 18.0442 82.5495 18.5222C82.9137 18.818 83.1982 19.1367 83.403 19.4781C83.6306 19.8195 83.8582 20.2747 84.0858 20.8437L86.7488 26.989H81.9691L79.3744 21.0827C79.1468 20.582 78.8964 20.2292 78.6233 20.0243C78.3502 19.8195 77.895 19.7171 77.2577 19.7171H73.6388V26.989H69.0298ZM73.6388 15.8933H78.3843C79.5906 15.8933 80.5352 15.6316 81.218 15.1081C81.9008 14.5618 82.2422 13.6514 82.2422 12.3768C82.2422 11.1478 81.9463 10.2487 81.3546 9.67972C80.7628 9.1107 79.8638 8.8262 78.6575 8.8262H73.6388V15.8933Z" fill="#EFF6FF" />
                                <path d="M98.5671 27.3304C95.7675 27.3304 93.5484 26.6363 91.9096 25.2479C90.2709 23.8367 89.4515 21.7086 89.4515 18.8636C89.4515 16.2916 90.1343 14.2546 91.5 12.7524C92.8883 11.2274 94.9482 10.465 97.6794 10.465C100.183 10.465 102.095 11.125 103.415 12.4451C104.758 13.7425 105.429 15.4495 105.429 17.5662V20.5023H93.7191C93.9695 21.7997 94.5612 22.6873 95.4944 23.1653C96.4504 23.6433 97.7932 23.8822 99.523 23.8822C100.388 23.8822 101.264 23.8026 102.152 23.6433C103.062 23.4839 103.836 23.2791 104.473 23.0287V26.3062C103.722 26.6476 102.846 26.898 101.845 27.0573C100.843 27.2394 99.7506 27.3304 98.5671 27.3304ZM93.7191 17.6686H101.401V16.781C101.401 15.8478 101.128 15.1195 100.581 14.596C100.035 14.0497 99.1133 13.7766 97.816 13.7766C96.291 13.7766 95.2213 14.0839 94.6068 14.6984C94.015 15.3129 93.7191 16.303 93.7191 17.6686Z" fill="#EFF6FF" />
                                <path d="M108.638 26.989V10.8064H112.906L113.077 12.3427C113.737 11.842 114.567 11.4095 115.569 11.0453C116.593 10.6584 117.663 10.465 118.778 10.465C120.918 10.465 122.477 10.9657 123.455 11.9671C124.434 12.9686 124.923 14.5163 124.923 16.6103V26.989H120.314V16.8493C120.314 15.7568 120.087 14.9829 119.632 14.5277C119.199 14.0725 118.38 13.8449 117.173 13.8449C116.468 13.8449 115.751 14.0042 115.023 14.3228C114.317 14.6415 113.725 15.0398 113.247 15.5178V26.989H108.638Z" fill="#EFF6FF" />
                                <path d="M135.094 27.3304C133.228 27.3304 131.84 26.8411 130.929 25.8624C130.042 24.8837 129.598 23.5522 129.598 21.8679V14.357H127.31V10.8064H129.598V7.32401L134.207 5.95838V10.8064H138.304L138.03 14.357H134.207V21.5607C134.207 22.4483 134.412 23.0629 134.821 23.4043C135.231 23.7229 135.868 23.8822 136.733 23.8822C137.37 23.8822 138.031 23.7684 138.713 23.5408V26.7159C138.213 26.9208 137.666 27.0687 137.075 27.1597C136.483 27.2735 135.823 27.3304 135.094 27.3304Z" fill="#EFF6FF" />
                                <path d="M146.166 27.3304C145.141 27.3304 144.185 27.1484 143.298 26.7842C142.433 26.3973 141.727 25.8396 141.181 25.1113C140.658 24.3602 140.396 23.427 140.396 22.3118C140.396 20.7185 140.953 19.4439 142.069 18.488C143.207 17.5321 144.88 17.0541 147.087 17.0541H151.867V16.6103C151.867 15.6088 151.583 14.9032 151.014 14.4936C150.467 14.0839 149.352 13.879 147.668 13.879C145.824 13.879 144.049 14.1635 142.342 14.7325V11.4892C143.093 11.1933 144.003 10.9543 145.073 10.7722C146.166 10.5674 147.349 10.465 148.624 10.465C151.059 10.465 152.937 10.9657 154.257 11.9671C155.6 12.9458 156.271 14.5277 156.271 16.7127V26.989H152.277L152.038 25.521C151.4 26.09 150.615 26.5338 149.682 26.8525C148.749 27.1711 147.577 27.3304 146.166 27.3304ZM147.429 24.2919C148.453 24.2919 149.341 24.1212 150.092 23.7798C150.843 23.4384 151.435 23.006 151.867 22.4825V19.9219H147.19C145.392 19.9219 144.493 20.6616 144.493 22.1411C144.493 23.575 145.471 24.2919 147.429 24.2919Z" fill="#EFF6FF" />
                                <path d="M159.983 26.989V10.8064H164.25L164.455 12.4793C165.183 12.024 166.082 11.6144 167.152 11.2502C168.245 10.8633 169.314 10.6015 170.361 10.465V13.9473C169.747 14.0383 169.075 14.1749 168.347 14.357C167.619 14.5391 166.925 14.7439 166.265 14.9715C165.605 15.1991 165.047 15.4381 164.592 15.6885V26.989H159.983Z" fill="#EFF6FF" />
                                <path d="M176.952 32.9978C176.247 32.9978 175.621 32.9523 175.074 32.8612C174.528 32.793 173.993 32.6564 173.47 32.4515V29.2082C173.857 29.3447 174.21 29.4358 174.528 29.4813C174.87 29.5268 175.211 29.5496 175.552 29.5496C176.486 29.5496 177.203 29.3334 177.703 28.9009C178.227 28.4685 178.75 27.7401 179.274 26.7159L172.036 10.8064H176.85L181.595 21.7997L186.307 10.8064H191.086L184.702 25.8624C184.11 27.2735 183.462 28.514 182.756 29.5837C182.073 30.6762 181.265 31.5184 180.332 32.1101C179.399 32.7019 178.272 32.9978 176.952 32.9978Z" fill="#EFF6FF" />
                            </svg>
                        </a>
                    </div>

                    <div className="flex gap-6 text-sm">
                        <a href="#inicio" className="!text-white !font-bold">Inicio</a>
                        <a href="#funcionalidades" className="!text-white !font-bold">Funcionalidades</a>
                        <a href="#contacto" className="!text-white !font-bold">Contacto</a>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zM17.25 6a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3C19.5304 3 20.0391 3.2107 20.4142 3.5858C20.7893 3.9609 21 4.4696 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.4696 3.21071 3.9609 3.58579 3.5858C3.96086 3.2107 4.46957 3 5 3H19ZM8.27 18.5V10.13H5.5V18.5H8.27ZM6.88 8.56C7.81 8.56 8.56 7.81 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C5.95 5.19 5.19 5.95 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5Z" />
                            </svg>
                        </a>
                    </div>
                </div>


                <hr className="border-white/30 my-6" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-white/80 gap-4">
                    <p>© 2025 Rentary. Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <button onClick={() => handleOpen("privacy")} className="underline text-white text-left">Política de Privacidad</button>
                        <button onClick={() => handleOpen("terms")} className="underline text-white text-left">Términos de Servicio</button>
                        <button onClick={() => handleOpen("cookies")} className="underline text-white text-left">Configuración de Cookies</button>
                    </div>
                </div>
            </footer>
            <ModalLegal open={modalOpen} onClose={() => setModalOpen(false)} content={currentContent} />
        </>
    );
}
export default Footer;