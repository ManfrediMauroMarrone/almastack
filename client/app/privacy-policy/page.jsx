'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { useSearchParams } from 'next/navigation';
import { translations } from '../../lang';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
    const searchParams = useSearchParams();
    const { language } = useLang(searchParams.get('lang') || 'it');

    const [openSections, setOpenSections] = useState({});

    // Toggle section visibility
    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Privacy policy sections
    const sections = {
        it: [
            {
                id: 'titolare',
                title: '1. TITOLARE DEL TRATTAMENTO',
                content: (
                    <div className="space-y-3">
                        <p>Il Titolare del trattamento dei dati personali è:</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">Almastack</p>
                            <p>Email: info@almastack.it</p>
                            <p>Telefono: +39 388 398 6292 / +39 334 287 2489</p>
                            <p>Sito web: www.almastack.it</p>
                        </div>
                    </div>
                )
            },
            {
                id: 'tipologie',
                title: '2. TIPOLOGIE DI DATI RACCOLTI',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">2.1 Dati forniti volontariamente dall&apos;utente</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>Dati di contatto:</strong> nome, cognome, indirizzo email, numero di telefono</li>
                                <li><strong>Dati aziendali:</strong> nome azienda, ruolo, settore di attività</li>
                                <li><strong>Contenuti:</strong> messaggi, richieste, informazioni fornite tramite form di contatto</li>
                                <li><strong>Dati di progetto:</strong> specifiche tecniche, requisiti, preferenze relative ai servizi richiesti</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">2.2 Dati raccolti automaticamente</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, tempo di permanenza</li>
                                <li><strong>Cookie e tecnologie simili:</strong> come specificato nella sezione Cookie Policy</li>
                                <li><strong>Dati di geolocalizzazione:</strong> se consentito dal dispositivo dell&apos;utente</li>
                                <li><strong>Dati analitici:</strong> interazioni con il sito, percorsi di navigazione, sorgenti di traffico</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'finalita',
                title: '3. FINALITÀ DEL TRATTAMENTO',
                content: (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.1 Finalità necessarie all&apos;erogazione dei servizi</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Rispondere alle richieste di informazioni e preventivi</li>
                                <li>Fornire i servizi di sviluppo web, consulenza IT e soluzioni digitali</li>
                                <li>Gestire la relazione contrattuale e amministrativa</li>
                                <li>Fornire assistenza tecnica e supporto clienti</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Base giuridica:</strong> Esecuzione di un contratto o misure precontrattuali (Art. 6.1.b GDPR)</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.2 Finalità di marketing (previo consenso)</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Invio di newsletter e comunicazioni promozionali</li>
                                <li>Informazioni su nuovi servizi, offerte e aggiornamenti</li>
                                <li>Inviti a eventi, webinar e iniziative formative</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Base giuridica:</strong> Consenso dell&apos;interessato (Art. 6.1.a GDPR)</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.3 Finalità di profilazione (previo consenso)</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Analisi delle preferenze e comportamenti per personalizzare l&apos;offerta</li>
                                <li>Creazione di profili utente per migliorare i servizi</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Base giuridica:</strong> Consenso dell&apos;interessato (Art. 6.1.a GDPR)</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.4 Finalità legittime</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Prevenzione frodi e sicurezza del sito</li>
                                <li>Miglioramento dei servizi e dell&apos;esperienza utente</li>
                                <li>Analisi statistiche aggregate e anonime</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Base giuridica:</strong> Legittimo interesse del Titolare (Art. 6.1.f GDPR)</p>
                        </div>
                    </div>
                )
            },
            {
                id: 'modalita',
                title: '4. MODALITÀ DEL TRATTAMENTO',
                content: (
                    <div>
                        <p className="mb-3">Il trattamento dei dati avviene mediante:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Strumenti elettronici e automatizzati con logiche strettamente correlate alle finalità</li>
                            <li>Misure di sicurezza adeguate per garantire riservatezza e integrità dei dati</li>
                            <li>Protocolli di sicurezza SSL/TLS per la trasmissione dei dati</li>
                            <li>Accesso limitato al personale autorizzato e formato</li>
                            <li>Backup periodici e sistemi di disaster recovery</li>
                        </ul>
                    </div>
                )
            },
            {
                id: 'destinatari',
                title: '5. DESTINATARI DEI DATI',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">5.1 Categorie di destinatari</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li><strong>Fornitori di servizi tecnici:</strong> hosting provider, servizi cloud, manutenzione IT</li>
                                <li><strong>Servizi di email marketing:</strong> per l&apos;invio di newsletter (es. Mailchimp, SendGrid)</li>
                                <li><strong>Servizi di analytics:</strong> Google Analytics, con IP anonimizzato</li>
                                <li><strong>Servizi di AI e automazione:</strong> OpenAI, Claude (Anthropic), per funzionalità AI integrate</li>
                                <li><strong>Professionisti e consulenti:</strong> commercialisti, avvocati, consulenti (vincolati da obbligo di riservatezza)</li>
                                <li><strong>Autorità pubbliche:</strong> quando richiesto per legge</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">5.2 Trasferimento dati extra-UE</h4>
                            <p className="text-gray-700 mb-2">Alcuni servizi utilizzati potrebbero comportare il trasferimento di dati in paesi extra-UE. In tali casi, garantiamo che:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>I trasferimenti avvengono verso paesi con decisione di adeguatezza della Commissione Europea</li>
                                <li>Sono implementate clausole contrattuali standard (SCC)</li>
                                <li>Sono adottate garanzie appropriate ai sensi degli Art. 46-49 GDPR</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'conservazione',
                title: '6. PERIODO DI CONSERVAZIONE',
                content: (
                    <div>
                        <p className="mb-3">I dati personali sono conservati per:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Dati contrattuali:</strong> per tutta la durata del rapporto e per 10 anni dalla conclusione (obblighi fiscali)</li>
                            <li><strong>Dati di contatto per marketing:</strong> fino a revoca del consenso o massimo 24 mesi dall&apos;ultimo contatto</li>
                            <li><strong>Dati di navigazione:</strong> massimo 26 mesi</li>
                            <li><strong>Cookie tecnici:</strong> per la durata della sessione</li>
                            <li><strong>Cookie di profilazione:</strong> massimo 12 mesi</li>
                        </ul>
                    </div>
                )
            },
            {
                id: 'diritti',
                title: '7. DIRITTI DELL\'INTERESSATO',
                content: (
                    <div className="space-y-4">
                        <p>Ai sensi degli Art. 15-22 GDPR, l'utente ha diritto di:</p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Accesso</strong>
                                <p className="text-sm text-gray-700">Ottenere conferma e informazioni sui dati trattati</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Rettifica</strong>
                                <p className="text-sm text-gray-700">Correggere dati inesatti o incompleti</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Cancellazione</strong>
                                <p className="text-sm text-gray-700">Richiedere la cancellazione dei dati (&quot;diritto all&apos;oblio&quot;)</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Limitazione</strong>
                                <p className="text-sm text-gray-700">Limitare il trattamento in casi specifici</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Portabilità</strong>
                                <p className="text-sm text-gray-700">Ricevere i dati in formato strutturato e leggibile</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Opposizione</strong>
                                <p className="text-sm text-gray-700">Opporsi al trattamento per motivi legittimi</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Revoca del consenso</strong>
                                <p className="text-sm text-gray-700">Ritirare il consenso in qualsiasi momento</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Reclamo</strong>
                                <p className="text-sm text-gray-700">Proporre reclamo al Garante Privacy</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                            <p className="text-sm">Per esercitare questi diritti, contattare: <strong>info@almastack.it</strong></p>
                        </div>
                    </div>
                )
            },
            {
                id: 'cookie',
                title: '8. COOKIE POLICY',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">8.1 Cosa sono i cookie</h4>
                            <p className="text-gray-700">I cookie sono piccoli file di testo salvati sul dispositivo dell&apos;utente durante la navigazione.</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">8.2 Tipologie di cookie utilizzati</h4>

                            <div className="space-y-3">
                                <div className="border-l-4 border-green-500 pl-4">
                                    <p className="font-semibold">Cookie tecnici (non richiedono consenso)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Cookie di sessione per la navigazione</li>
                                        <li>Cookie di funzionalità per memorizzare preferenze</li>
                                        <li>Cookie di sicurezza per prevenire frodi</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <p className="font-semibold">Cookie analitici (previo consenso)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Google Analytics con IP anonimizzato</li>
                                        <li>Cookie statistici per analisi aggregate</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4">
                                    <p className="font-semibold">Cookie di profilazione e marketing (previo consenso)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Google Ads per remarketing</li>
                                        <li>Facebook Pixel per campagne pubblicitarie</li>
                                        <li>LinkedIn Insight Tag per analisi professionali</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">8.3 Gestione dei cookie</h4>
                            <p className="text-gray-700">L&apos;utente può gestire le preferenze sui cookie tramite:</p>
                            <ul className="list-disc list-inside text-gray-700 mt-2">
                                <li>Il banner di consenso presente sul sito</li>
                                <li>Le impostazioni del proprio browser</li>
                                <li>I link di opt-out dei singoli servizi</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'sicurezza',
                title: '9. SICUREZZA DEI DATI',
                content: (
                    <div>
                        <p className="mb-3">Adottiamo misure tecniche e organizzative appropriate, tra cui:</p>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Crittografia dei dati in transito (HTTPS/TLS)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Firewall e sistemi di rilevamento intrusioni</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Controlli di accesso basati su ruoli</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Formazione periodica del personale</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Audit di sicurezza regolari</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Procedure di incident response</span>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                id: 'minori',
                title: '10. MINORI',
                content: (
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            Il nostro sito non è destinato a minori di 16 anni. Non raccogliamo consapevolmente dati di minori senza il consenso dei genitori o tutori legali.
                        </p>
                    </div>
                )
            },
            {
                id: 'modifiche',
                title: '11. MODIFICHE ALLA PRIVACY POLICY',
                content: (
                    <div>
                        <p className="text-gray-700">
                            Ci riserviamo il diritto di modificare questa Privacy Policy. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento.
                            Per modifiche sostanziali, forniremo notifica agli utenti registrati via email.
                        </p>
                    </div>
                )
            }
        ],
        en: [
            {
                id: 'controller',
                title: '1. DATA CONTROLLER',
                content: (
                    <div className="space-y-3">
                        <p>The Data Controller for personal data processing is:</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">Almastack</p>
                            <p>Email: info@almastack.it</p>
                            <p>Phone: +39 388 398 6292 / +39 334 287 2489</p>
                            <p>Website: www.almastack.it</p>
                        </div>
                    </div>
                )
            },
            {
                id: 'types',
                title: '2. TYPES OF DATA COLLECTED',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">2.1 Data voluntarily provided by the user</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>Contact data:</strong> name, surname, email address, phone number</li>
                                <li><strong>Company data:</strong> company name, role, business sector</li>
                                <li><strong>Content:</strong> messages, requests, information provided through contact forms</li>
                                <li><strong>Project data:</strong> technical specifications, requirements, preferences related to requested services</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">2.2 Data collected automatically</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>Navigation data:</strong> IP address, browser type, operating system, pages visited, time spent</li>
                                <li><strong>Cookies and similar technologies:</strong> as specified in the Cookie Policy section</li>
                                <li><strong>Geolocation data:</strong> if permitted by the user&apos;s device</li>
                                <li><strong>Analytics data:</strong> site interactions, navigation paths, traffic sources</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'purposes',
                title: '3. PURPOSES OF PROCESSING',
                content: (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.1 Purposes necessary for service provision</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Responding to information and quote requests</li>
                                <li>Providing web development, IT consulting, and digital solution services</li>
                                <li>Managing contractual and administrative relationships</li>
                                <li>Providing technical assistance and customer support</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Legal basis:</strong> Performance of a contract or pre-contractual measures (Art. 6.1.b GDPR)</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.2 Marketing purposes (with consent)</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Sending newsletters and promotional communications</li>
                                <li>Information about new services, offers, and updates</li>
                                <li>Invitations to events, webinars, and training initiatives</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Legal basis:</strong> Consent of the data subject (Art. 6.1.a GDPR)</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.3 Profiling purposes (with consent)</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Analysis of preferences and behaviors to personalize offers</li>
                                <li>Creating user profiles to improve services</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Legal basis:</strong> Consent of the data subject (Art. 6.1.a GDPR)</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">3.4 Legitimate purposes</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Fraud prevention and site security</li>
                                <li>Service and user experience improvement</li>
                                <li>Aggregated and anonymous statistical analysis</li>
                            </ul>
                            <p className="mt-2 text-sm"><strong>Legal basis:</strong> Legitimate interest of the Controller (Art. 6.1.f GDPR)</p>
                        </div>
                    </div>
                )
            },
            {
                id: 'methods',
                title: '4. PROCESSING METHODS',
                content: (
                    <div>
                        <p className="mb-3">Data processing is carried out through:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Electronic and automated tools with logic strictly related to the purposes</li>
                            <li>Adequate security measures to ensure data confidentiality and integrity</li>
                            <li>SSL/TLS security protocols for data transmission</li>
                            <li>Limited access to authorized and trained personnel</li>
                            <li>Periodic backups and disaster recovery systems</li>
                        </ul>
                    </div>
                )
            },
            {
                id: 'recipients',
                title: '5. DATA RECIPIENTS',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">5.1 Categories of recipients</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li><strong>Technical service providers:</strong> hosting providers, cloud services, IT maintenance</li>
                                <li><strong>Email marketing services:</strong> for newsletter delivery (e.g., Mailchimp, SendGrid)</li>
                                <li><strong>Analytics services:</strong> Google Analytics, with anonymized IP</li>
                                <li><strong>AI and automation services:</strong> OpenAI, Claude (Anthropic), for integrated AI features</li>
                                <li><strong>Professionals and consultants:</strong> accountants, lawyers, consultants (bound by confidentiality obligations)</li>
                                <li><strong>Public authorities:</strong> when required by law</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">5.2 Extra-EU data transfers</h4>
                            <p className="text-gray-700 mb-2">Some services used may involve data transfer to non-EU countries. In such cases, we ensure that:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Transfers occur to countries with adequacy decisions from the European Commission</li>
                                <li>Standard contractual clauses (SCC) are implemented</li>
                                <li>Appropriate safeguards are adopted pursuant to Art. 46-49 GDPR</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'retention',
                title: '6. DATA RETENTION PERIOD',
                content: (
                    <div>
                        <p className="mb-3">Personal data is retained for:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Contractual data:</strong> for the entire duration of the relationship and for 10 years after conclusion (tax obligations)</li>
                            <li><strong>Contact data for marketing:</strong> until consent withdrawal or maximum 24 months from last contact</li>
                            <li><strong>Navigation data:</strong> maximum 26 months</li>
                            <li><strong>Technical cookies:</strong> for the session duration</li>
                            <li><strong>Profiling cookies:</strong> maximum 12 months</li>
                        </ul>
                    </div>
                )
            },
            {
                id: 'rights',
                title: '7. DATA SUBJECT RIGHTS',
                content: (
                    <div className="space-y-4">
                        <p>Pursuant to Art. 15-22 GDPR, users have the right to:</p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Access</strong>
                                <p className="text-sm text-gray-700">Obtain confirmation and information about processed data</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Rectification</strong>
                                <p className="text-sm text-gray-700">Correct inaccurate or incomplete data</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Erasure</strong>
                                <p className="text-sm text-gray-700">Request data deletion (&quot;right to be forgotten&quot;)</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Restriction</strong>
                                <p className="text-sm text-gray-700">Restrict processing in specific cases</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Portability</strong>
                                <p className="text-sm text-gray-700">Receive data in a structured, readable format</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Objection</strong>
                                <p className="text-sm text-gray-700">Object to processing for legitimate reasons</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Consent withdrawal</strong>
                                <p className="text-sm text-gray-700">Withdraw consent at any time</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                                <strong>Complaint</strong>
                                <p className="text-sm text-gray-700">Lodge a complaint with the Data Protection Authority</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                            <p className="text-sm">To exercise these rights, contact: <strong>info@almastack.it</strong></p>
                        </div>
                    </div>
                )
            },
            {
                id: 'cookies',
                title: '8. COOKIE POLICY',
                content: (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">8.1 What are cookies</h4>
                            <p className="text-gray-700">Cookies are small text files saved on the user&apos;s device during navigation.</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">8.2 Types of cookies used</h4>

                            <div className="space-y-3">
                                <div className="border-l-4 border-green-500 pl-4">
                                    <p className="font-semibold">Technical cookies (no consent required)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Session cookies for navigation</li>
                                        <li>Functionality cookies to store preferences</li>
                                        <li>Security cookies to prevent fraud</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <p className="font-semibold">Analytics cookies (with consent)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Google Analytics with anonymized IP</li>
                                        <li>Statistical cookies for aggregate analysis</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-red-500 pl-4">
                                    <p className="font-semibold">Profiling and marketing cookies (with consent)</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        <li>Google Ads for remarketing</li>
                                        <li>Facebook Pixel for advertising campaigns</li>
                                        <li>LinkedIn Insight Tag for professional analytics</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">8.3 Cookie management</h4>
                            <p className="text-gray-700">Users can manage cookie preferences through:</p>
                            <ul className="list-disc list-inside text-gray-700 mt-2">
                                <li>The consent banner on the site</li>
                                <li>Browser settings</li>
                                <li>Opt-out links for individual services</li>
                            </ul>
                        </div>
                    </div>
                )
            },
            {
                id: 'security',
                title: '9. DATA SECURITY',
                content: (
                    <div>
                        <p className="mb-3">We adopt appropriate technical and organizational measures, including:</p>
                        <div className="grid md:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Data encryption in transit (HTTPS/TLS)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Firewall and intrusion detection systems</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Role-based access controls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Regular staff training</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Regular security audits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Incident response procedures</span>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                id: 'minors',
                title: '10. MINORS',
                content: (
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            Our site is not intended for minors under 16 years of age. We do not knowingly collect data from minors without parental or guardian consent.
                        </p>
                    </div>
                )
            },
            {
                id: 'changes',
                title: '11. CHANGES TO THE PRIVACY POLICY',
                content: (
                    <div>
                        <p className="text-gray-700">
                            We reserve the right to modify this Privacy Policy. Changes will be published on this page with the updated date indicated.
                            For substantial changes, we will notify registered users via email.
                        </p>
                    </div>
                )
            }
        ]
    };

    return (
        <div className="py-16 pt-30 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-600">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections[language].map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {section.title}
                                </h3>
                                {openSections[section.id] ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {openSections[section.id] && (
                                <div className="px-6 pb-6">
                                    <div className="border-t pt-4">
                                        {section.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Contatti e Domande</h2>
                    <p className="mb-6">
                        Per qualsiasi domanda o richiesta relativa al trattamento dei dati personali:
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5" />
                            <a href="mailto:info@almastack.it" className="hover:underline">
                                info@almastack.it
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5" />
                            <span>+39 388 398 6292 / +39 334 287 2489</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        Questa Privacy Policy è stata redatta in conformità al Regolamento (UE) 2016/679 (GDPR)
                        e al D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
                    </p>
                </div>
            </div>
        </div>
    );
};

const PrivacyPolicyPage = () => {
    const searchParams = useSearchParams();
    const { language } = useLang(searchParams.get('lang') || 'it');

    const translate = translations[language];

    return (
        <>
            <Navbar translate={translate} />
            <PrivacyPolicy />
            <Footer translate={translate} />
        </>
    )
}

export default PrivacyPolicyPage;