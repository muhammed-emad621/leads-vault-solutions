import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import logoImage from "../assets/logo.png";
import mapImage from "../assets/map.png";

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Leads Vault Solutions home">
      <span className="logo-mark">
        <img src={logoImage} alt="Leads Vault Solutions logo" />
      </span>
      <span>
        Leads Vault <em>Solutions</em>
      </span>
    </a>
  );
}

function NationMap() {
  return (
    <div className="map-card" aria-label="Nationwide coverage map">
      <div className="map-meta">
        <span>Coverage</span>
        <strong>50 states</strong>
      </div>
      <img
        className="map-image"
        src={mapImage}
        alt="Hand-drawn map of the United States showing nationwide coverage"
      />
      <div className="map-footer">
        <span>Local insight</span>
        <span>National reach</span>
      </div>
    </div>
  );
}

function PropertyShowcase() {
  const properties = [
    [
      "Motivated seller leads",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
      "A clear reason, a real conversation, a better starting point.",
    ],
    [
      "Opportunities worth a call",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
      "Property context that helps investors move with confidence.",
    ],
    [
      "Markets across the country",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85",
      "From your backyard to the next market you want to own.",
    ],
  ];
  return (
    <section className="property-section" id="opportunities">
      <div className="section-tag">02 / Real opportunities</div>
      <div className="property-heading">
        <h2>
          Real homes.
          <br />
          <i>Real conversations.</i>
        </h2>
        <p>
          We bring the human story back into lead generation: the home, the
          situation, and the next best conversation.
        </p>
      </div>
      <div className="property-grid">
        {properties.map(([title, image, copy]) => (
          <article className="property-card" key={title}>
            <img src={image} alt={title} />
            <div>
              <span>Leads Vault / {title}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Dashboard({ readyMode, setReadyMode }) {
  const [activeCard, setActiveCard] = useState("New leads");
  const cards = [
    ["New leads", "12", "Ready to call"],
    ["In conversation", "08", "Follow-up due"],
    ["Appointments", "05", "This week"],
  ];
  return (
    <div className={`dashboard ${readyMode ? "is-ready" : ""}`}>
      <div className="dashboard-head">
        <div>
          <span className="window-dot red" />
          <span className="window-dot yellow" />
          <span className="window-dot green" />
        </div>
        <span className="dashboard-label">Vault / Command center</span>
        <button
          className="mode-toggle"
          onClick={() => setReadyMode(!readyMode)}
          aria-pressed={readyMode}
        >
          <span className="status-dot" />
          {readyMode ? "Ready mode on" : "Ready mode"}
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-intro">
          <span className="eyebrow">
            {readyMode ? "Your day, unlocked" : "Your next move"}
          </span>
          <h2>
            {readyMode
              ? "Let’s work the warmest leads first."
              : "A clearer pipeline starts here."}
          </h2>
          <p>
            Every lead arrives with context, so your team can spend less time
            sorting and more time connecting.
          </p>
        </div>
        <div className="pipeline-head">
          <span>Pipeline overview</span>
          <span>Today, 9:41 AM</span>
        </div>
        <div className="pipeline-grid">
          {cards.map(([title, count, detail]) => (
            <button
              key={title}
              className={`pipeline-card ${activeCard === title ? "active" : ""}`}
              onClick={() => setActiveCard(title)}
            >
              <span>{title}</span>
              <strong>{count}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </div>
        <div className="next-lead">
          <div>
            <span className="mini-label">Next best conversation</span>
            <strong>Moving situation · Hudson, FL</strong>
            <span className="muted-line">
              Seller is open to a call after 5pm
            </span>
          </div>
          <span className="arrow">↗</span>
        </div>
      </div>
    </div>
  );
}

function LeadForm() {
  const [state, setState] = useState("idle");
  async function submitForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    if (!formEndpoint) {
      const subject = encodeURIComponent(
        `Lead inquiry from ${data.get("name")}`,
      );
      const body = encodeURIComponent(
        [...data.entries()]
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      );
      window.location.href = `mailto:hello@leadsvaultsolutions.com?subject=${subject}&body=${body}`;
      setState("fallback");
      return;
    }
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }
  return (
    <form
      className="lead-form"
      onSubmit={submitForm}
      aria-describedby="form-status"
      aria-busy={state === "sending"}
    >
      <div className="form-row">
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            required
            placeholder="Your name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="(555) 555-5555"
          />
        </label>
        <label>
          Market
          <input name="market" placeholder="City, state, or nationwide" />
        </label>
      </div>
      <label>
        What would make you ready?
        <textarea
          name="message"
          required
          rows="5"
          placeholder="Tell us about the leads, markets, or CRM support you need."
        />
      </label>
      <input
        type="hidden"
        name="source"
        value="Leads Vault Solutions website"
      />
      <label className="form-trap" aria-hidden="true">
        Leave this blank
        <input name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-actions">
        <button
          className="button button-dark"
          type="submit"
          disabled={state === "sending"}
        >
          {state === "sending" ? "Sending..." : "Send my details"}{" "}
          <span>↗</span>
        </button>
        <span className={`form-status ${state}`} id="form-status" role="status" aria-live="polite">
          {state === "sent" && "Received. We will be in touch."}
          {state === "fallback" && "Your email app has the details ready. Send it to complete delivery."}
          {state === "error" && "Could not send. Please email hello@leadsvaultsolutions.com directly."}
        </span>
      </div>
    </form>
  );
}

function BenefitCards() {
  const benefits = [
    ["🔥", "Fresh Leads", "Recently generated opportunities from homeowners looking to sell."],
    ["✅", "Verified Leads", "Seller information reviewed before delivery."],
    ["🔒", "Exclusive Leads", "Leads can be reserved exclusively for your market."],
    ["⚡", "Quick-Sale Leads", "Homeowners with a shorter selling timeline."],
  ];
  return <section className="benefits-section" id="benefits"><div className="section-tag">01 / What you get</div><h2>Better leads.<br /><i>Better conversations.</i></h2><div className="benefit-grid">{benefits.map(([icon, title, copy]) => <article className="benefit-card" key={title}><span className="benefit-icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}

function SampleLead() {
  return <section className="sample-section" id="sample-lead"><div className="sample-copy"><div className="section-tag">02 / See the opportunity</div><h2>Know what you’re<br /><i>buying into.</i></h2><p>Every opportunity starts with useful context. Here is the kind of seller detail your team can act on.</p><a className="button button-light" href="#contact">Get similar leads <span>↗</span></a></div><article className="sample-lead-card"><div className="sample-card-top"><span>Sample seller lead</span><span className="lead-status">Owner verified ✓</span></div><div className="seller-heading"><div><h3>John M.</h3><p>📍 Tampa, FL</p></div><span className="motivation-badge">🔥 High motivation</span></div><div className="lead-details"><p><span>Property</span><strong>Single Family</strong></p><p><span>Estimated value</span><strong>$285,000</strong></p><p><span>Asking price</span><strong>$210,000</strong></p><p><span>Motivation</span><strong>Relocating</strong></p><p><span>Timeline</span><strong>ASAP</strong></p><p><span>Condition</span><strong>Needs repairs</strong></p><p><span>Phone</span><strong>Available</strong></p></div></article></section>;
}

function CoverageProof() {
  return <section className="coverage-section" id="coverage"><div><div className="section-tag">03 / Nationwide coverage</div><h2>Local markets.<br /><i>National reach.</i></h2><p>Choose the states, cities, counties, or ZIP codes where you want to buy. We help you build a pipeline that travels with your strategy.</p></div><NationMap /></section>;
}

function HowItWorks() {
  const steps = [["01", "Choose Your Market", "Select your states, cities, counties or ZIP codes."], ["02", "We Find & Verify Sellers", "Our team identifies potential opportunities and verifies seller information."], ["03", "Receive Your Leads", "Get the lead details and follow up directly with the seller."]];
  return <section className="process-section" id="how-it-works"><div className="section-tag">04 / How it works</div><div className="process-heading"><h2>A simple path to<br /><i>your next deal.</i></h2><p>Tell us where you buy. We’ll help you focus on the homeowners most likely to be ready.</p></div><div className="process-steps">{steps.map(([number, title, copy], index) => <div className="process-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div>{index < steps.length - 1 && <b aria-hidden="true">↓</b>}</div>)}</div></section>;
}

function InvestorTypes() {
  const types = [["🏠", "Wholesalers"], ["🔨", "Fix & Flip Investors"], ["💰", "Buy & Hold Investors"], ["🏢", "Real Estate Investment Companies"]];
  return <section className="investor-section" id="investors"><div className="section-tag">05 / Built for investors</div><div className="investor-layout"><div><h2>Built for<br /><i>real estate investors.</i></h2><p>Whether you’re buying one property or building a nationwide acquisition pipeline, we help you connect with homeowners who may be ready to sell.</p></div><div className="investor-types">{types.map(([icon, title]) => <div key={title}><span aria-hidden="true">{icon}</span><strong>{title}</strong><b>↗</b></div>)}</div></div></section>;
}

function Pricing() {
  const plans = [["Starter", "For investors testing a new market", "Request pricing"], ["Growth", "For active investors needing consistent lead flow", "Request pricing"], ["Custom", "Custom markets & lead volume", "Talk to sales"]];
  return <section className="pricing-section" id="pricing"><div className="section-tag">06 / Lead plans</div><div className="pricing-heading"><h2>Choose your<br /><i>lead plan.</i></h2><p>Start with the market and volume that fits your acquisition strategy.</p></div><div className="pricing-grid">{plans.map(([title, copy, action], index) => <article className={`pricing-card ${index === 1 ? "featured" : ""}`} key={title}><span className="plan-name">{title}</span><p>{copy}</p><a href="#contact">{action} <span>↗</span></a></article>)}</div><p className="pricing-note">Pay only for the leads you receive.</p></section>;
}

function WhyUs() {
  const points = ["Nationwide U.S. Coverage", "Fresh Seller Opportunities", "Lead Verification", "Exclusive Lead Options", "Detailed Seller Information", "Fast Lead Delivery", "Investor-Focused Support"];
  return <section className="why-section" id="why-us"><div className="section-tag">07 / Why Leads Vault Solutions</div><div className="why-layout"><h2>The details that<br /><i>move deals forward.</i></h2><div className="why-list">{points.map((point) => <div key={point}><span>✓</span><strong>{point}</strong></div>)}</div></div></section>;
}

function App() {
  const [readyMode, setReadyMode] = useState(false);
  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <Logo />
        <nav aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#benefits">What you get</a>
          <a href="#sample-lead">Sample lead</a>
          <a href="#coverage">Nationwide</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">
          Get your leads <span>↗</span>
        </a>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Nationwide seller opportunities</span>
            <h1>
              Motivated seller
              <br />
              <i>leads.</i>
            </h1>
            <p className="hero-text">
              Find homeowners ready to sell. Exclusive, verified seller opportunities delivered directly to real estate investors across the U.S.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contact">
                Get your leads <span>↗</span>
              </a>
              <a className="text-link" href="#how-it-works">
                See how it works <span>↓</span>
              </a>
            </div>
            <div className="hero-proof">
              <span>Fresh Leads</span><span>Verified Sellers</span><span>Exclusive Opportunities</span><span>Nationwide</span>
            </div>
          </div>
          <div className="hero-visual">
            <Dashboard readyMode={readyMode} setReadyMode={setReadyMode} />
          </div>
        </section>
        <BenefitCards />
        <SampleLead />
        <CoverageProof />
        <HowItWorks />
        <InvestorTypes />
        <Pricing />
        <WhyUs />
        <section className="contact-section" id="contact">
          <div className="section-tag">08 / Ready to find your next deal?</div>
          <div className="contact-layout">
            <div>
              <img
                className="section-image contact-image"
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=90"
                alt="Inviting home exterior"
              />
              <h2>
                Ready to find
                <br />
                <i>your next deal?</i>
              </h2>
              <p>
                Tell us where you buy and what type of sellers you’re looking for.
              </p>
              <div className="contact-aside">
                <span>Prefer email?</span>
                <a href="mailto:hello@leadsvaultsolutions.com">
                  hello@leadsvaultsolutions.com
                </a>
                <a
                  className="facebook-link"
                  href="https://www.facebook.com/leadsvaultsolutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Leads Vault Solutions on Facebook"
                >
                  <span className="facebook-mark" aria-hidden="true">f</span>
                  <span>
                    <strong>Follow us on Facebook</strong>
                    <small>See Leads Vault Solutions updates</small>
                  </span>
                  <span className="facebook-arrow" aria-hidden="true">↗</span>
                </a>
                <a
                  className="facebook-link whatsapp-link"
                  href="https://wa.me/201229098083"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Leads Vault Solutions on WhatsApp"
                >
                  <span className="whatsapp-mark" aria-hidden="true">
                    <img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" />
                  </span>
                  <span>
                    <strong>Message us on WhatsApp</strong>
                    <small>+20 12 29098083</small>
                  </span>
                  <span className="facebook-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>
      <footer>
        <Logo />
        <span>Motivated seller leads for real estate investors</span>
        <span>© 2026 Leads Vault Solutions</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
