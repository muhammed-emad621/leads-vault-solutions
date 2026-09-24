import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Leads Vault Solutions home">
      <span className="logo-mark">
        <img src="/assets/logo.png" alt="Leads Vault Solutions logo" />
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
        src="/assets/map.png"
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

function App() {
  const [readyMode, setReadyMode] = useState(false);
  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <Logo />
        <nav aria-label="Primary navigation">
          <a href="#top">Home</a>
          <a href="#how-it-works">Nationwide</a>
          <a href="#opportunities">Lead opportunities</a>
          <a href="#crm">CRM thinking</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">
          Get started <span>↗</span>
        </a>
      </header>
      <main id="main-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Motivated leads · built for action</span>
            <h1>
              Ready when
              <br />
              <i>opportunity</i> calls.
            </h1>
            <p className="hero-text">
              Leads Vault Solutions gives real estate professionals the context,
              coverage, and confidence to make the next call count.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#contact">
                Talk to our team <span>↗</span>
              </a>
              <a className="text-link" href="#opportunities">
                See lead opportunities <span>↓</span>
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <b>01</b> Clear lead context
              </span>
              <span>
                <b>02</b> Nationwide reach
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <Dashboard readyMode={readyMode} setReadyMode={setReadyMode} />
          </div>
        </section>
        <section className="map-section" id="how-it-works">
          <div className="section-tag">01 / The reach</div>
          <div className="map-layout">
            <div>
              <h2>
                Local signals.
                <br />
                <i>Nationwide</i> momentum.
              </h2>
              <p>
                From a single neighborhood to your next market, we help you see
                where the opportunity is and what to do with it.
              </p>
              <a className="text-link dark-link" href="#contact">
                Explore your market <span>↗</span>
              </a>
            </div>
            <NationMap />
          </div>
        </section>
        <PropertyShowcase />
        <section className="crm-section" id="crm">
          <div className="section-tag">03 / The system</div>
          <div className="crm-layout">
            <div>
              <img
                className="section-image crm-image"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=90"
                alt="Bright real estate team workspace"
              />
              <h2>
                Not just a name
                <br />
                in a spreadsheet.
              </h2>
              <p>
                Think of it as your front door to a better CRM: organized
                details, clear next steps, and a team that understands the
                handoff.
              </p>
            </div>
            <div className="feature-list">
              <div>
                <span>01</span>
                <strong>Capture the full story</strong>
                <p>
                  Know the reason, timing, and market before you ever pick up
                  the phone.
                </p>
              </div>
              <div>
                <span>02</span>
                <strong>Keep your pipeline moving</strong>
                <p>
                  Turn promising conversations into a repeatable process your
                  team can own.
                </p>
              </div>
              <div>
                <span>03</span>
                <strong>Stay ready</strong>
                <p>
                  When the right lead lands, you already know your next move.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="section-tag">04 / Make a connection</div>
          <div className="contact-layout">
            <div>
              <img
                className="section-image contact-image"
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=90"
                alt="Inviting home exterior"
              />
              <h2>
                Tell us what
                <br />
                <i>ready</i> looks like.
              </h2>
              <p>
                Markets, lead volume, CRM support, or all three. Give us the
                useful version and we’ll take it from there.
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
                  <span className="whatsapp-mark" aria-hidden="true">☎</span>
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
        <span>Motivated leads for real estate professionals</span>
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
