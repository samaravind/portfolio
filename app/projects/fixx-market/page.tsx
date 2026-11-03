import type { Metadata } from "next";
import ProjectDetail from "../../_components/project-detail";
import ProjectShowcase from "../../_components/project-showcase";
import { projects } from "../../_data/projects";
import styles from "../../_components/project-detail.module.css";

const project = projects[0];
export const metadata: Metadata = { title: "Fixx Market — A connected commerce experience | Sam Aravind", description: project.description };

const screenshots = [
  { src: "/projects/fixx-market/storefront.png", alt: "Fixx Market electronics storefront", caption: "01 / Storefront — category navigation and rotating featured collections." },
  { src: "/projects/fixx-market/catalog.png", alt: "Fixx Market product catalog", caption: "02 / Product catalog — a responsive grid with demo pricing, offers, and ratings." },
  { src: "/projects/fixx-market/watches.png", alt: "Fixx Market watches collection", caption: "03 / Category view — switching categories changes the product collection." },
];

export default function FixxMarketPage() {
  return <ProjectDetail project={project} subtitle="From the first discovery to the final order. A full-stack shopping project built around the way people shop." facts={[{label:"Project",value:"Full-stack e-commerce application"},{label:"My contribution",value:"Interface, APIs & data integration"},{label:"Featured here",value:"Interactive frontend prototype"}]}>
    <section id="overview" className={styles.section}>
      <div className={styles.overview}>
        <div><p className="eyebrow"><span className="section-index">01 /</span> THE IDEA</p><h2>A complete journey.<br /><span className="muted">One connected system.</span></h2></div>
        <div className={styles.prose}><p>Fixx Market brings the core stages of online shopping into a responsive web application. The project spans product discovery, category browsing, wishlists, cart management, and checkout.</p><p>My full-stack work covers a Next.js interface, Python FastAPI endpoints, Convex data integration, and Clerk authentication. The interface preview below comes from the available frontend prototype.</p></div>
      </div>
      <div className={styles.featureGrid}>{[
        {title:"Product discovery",copy:"Explore accessories, watches, electronics, and gaming products through category-based collections."},
        {title:"Wishlist & cart",copy:"Keep selected items together, with saved products and a dedicated cart view."},
        {title:"Personal access",copy:"The full project scope includes authenticated access to each shopper’s data."},
        {title:"Order creation",copy:"The full project scope covers delivery details, payment selection, checkout validation, and order creation."},
      ].map((feature,i)=><div className={styles.feature} key={feature.title}><span>0{i+1}</span><h3>{feature.title}</h3><p>{feature.copy}</p></div>)}</div>
    </section>
    <section id="showcase" className={styles.section}>
      <div className={styles.sectionHeader}><div><p className="eyebrow"><span className="section-index">02 /</span> THE EXPERIENCE</p><h2>A look inside Fixx.</h2></div><p>Actual screens from the frontend prototype. Open any image for a closer look, or watch the interface tour below.</p></div>
      <ProjectShowcase project={project} images={screenshots} video={{src:"/projects/fixx-market/interface-tour.mp4",poster:"/projects/fixx-market/storefront.png",caption:"Frontend interface tour · 13 seconds · An edited sequence of actual screenshots, using demo product data."}} />
    </section>
    <section id="implementation" className={styles.section}>
      <div className={styles.sectionHeader}><div><p className="eyebrow"><span className="section-index">03 /</span> UNDER THE SURFACE</p><h2>Inside the frontend.</h2></div><p>A closer look at the source behind the screens shown above.</p></div>
      <div className={styles.implementationList}>{[
        {title:"Category-driven UI",copy:"React state switches the catalog between product collections. A timed carousel cycles through featured promotions, with manual slide controls."},
        {title:"Dedicated product routes",copy:"Catalog cards navigate to a product slug route. This frontend build includes a prototype detail screen, with product-data integration left open."},
        {title:"Persistent selections",copy:"Cart and wishlist actions store demo selections in localStorage. Separate pages read those saved items and link back to the product route."},
        {title:"Responsive presentation",copy:"Next.js and Tailwind CSS organize the layout, product cards, navigation, and responsive grids. Product artwork is served from local assets."},
      ].map((item,i)=><div className={styles.implementationRow} key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.copy}</p></div>)}</div>
      <div className={`${styles.sectionHeader} implementation-heading`}><div><p className="eyebrow">THE FULL PROJECT</p><h2>Built across the stack.</h2></div><p>The broader architecture described in my resume connects the interface to Python APIs, data, and identity.</p></div>
      <div className={styles.architecture}>
        <div><small>EXPERIENCE</small><h3>Next.js</h3><p>Product browsing<br />Wishlist & cart<br />Checkout interface</p></div><span>→</span>
        <div><small>APPLICATION LOGIC</small><h3>FastAPI</h3><p>Cart operations<br />Wishlist endpoints<br />Order APIs</p></div><span>↔</span>
        <div><small>DATA & IDENTITY</small><h3>Convex + Clerk</h3><p>Connected application data<br />Authentication<br />User-based access</p></div>
      </div>
      <p className={styles.scopeNote}>The supplied frontend snapshot runs independently with demo data and browser storage. FastAPI, Convex, Clerk, and the complete checkout backend are part of the resume’s project description; their source is not included in this preview.</p>
    </section>
    <section id="workflow" className={styles.section}>
      <p className="eyebrow"><span className="section-index">04 /</span> THE FULL PROJECT WORKFLOW</p><h2>From discovery to order.</h2>
      <ol className={styles.workflow}>{[
        {title:"Discover",copy:"Explore products and browse by category."},
        {title:"Make it personal",copy:"Save items to a wishlist or add them to the cart."},
        {title:"Check out",copy:"Provide a delivery address and select a payment option."},
        {title:"Create the order",copy:"Validate checkout details and create the order with its items."},
      ].map((step,i)=><li key={step.title}><span>0{i+1}</span><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol>
    </section>
  </ProjectDetail>;
}
