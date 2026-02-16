"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import styles from "./projects.module.css";

function useOverflowFlags(ref, deps) {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    if (!ref.current) return;

    const compute = () => {
      if (!ref.current) return {};
      const next = {};
      const nodes = ref.current.querySelectorAll("[data-overflow-key]");
      nodes.forEach((el) => {
        const key = el.getAttribute("data-overflow-key");
        next[key] = el.scrollWidth > el.clientWidth + 1; // +1 for rounding
      });
      setFlags(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(ref.current);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return flags;
}

export default function ProjectsRow({project, index = 0, delay = 0}) {
  const rowRef = useRef(null);
  const descRef = useRef(null);
  const flags = useOverflowFlags(rowRef, [project?._id]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(6);

  useEffect(() => {
    // Reset quando il componente viene montato (nuova pagina)
    setIsVisible(false);
    
    // Aspetta che la pagina abbia fatto fade in prima di iniziare l'animazione delle righe
    const pageTransitionDelay = 500; // Delay per il fade in della pagina
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, pageTransitionDelay + delay);
    return () => clearTimeout(timer);
  }, [delay, project?._id]); // Reset quando cambia il progetto

  const orderRaw = project?.order ?? "";
  const orderNum = typeof orderRaw === "number" ? orderRaw : parseInt(orderRaw, 10);
  const orderFormatted = !isNaN(orderNum) && orderNum > 0 
    ? String(orderNum).padStart(3, '0')
    : "";
  
  // Mappa valori categorie ai loro titoli (come definito nello schema Sanity)
  const categoryMap = {
    'art-direction': 'Art Direction',
    'brand-identity': 'Brand Identity',
    'editorial': 'Editorial',
    'graphic-design': 'Graphic Design',
    'product-design': 'Product Design',
    '3d-modeling': '3D Modeling',
    'web-design': 'Web Design',
    'development': 'Development',
    'type-design': 'Type Design'
  };
  
  const title = project?.title ?? "";
  const slug = project?.slug?.current;
  const client = project?.info?.client?.value ?? "";
  const year = project?.info?.year?.value ?? "";
  const categoriesRaw = Array.isArray(project?.categories) ? project.categories : [];
  const categories = categoriesRaw
    .map(cat => categoryMap[cat] || cat)
    .join(" / ");
  const desc = project?.description ?? "";
  const excerpt = desc.length > 140 ? `${desc.slice(0, 140)}…` : desc;

  // Calcola la durata dell'animazione basata sulla lunghezza del testo
  useEffect(() => {
    if (!descRef.current) return;

    const calculateDuration = () => {
      const element = descRef.current;
      if (!element) return;

      const container = element.parentElement;
      if (!container) return;

      // La larghezza totale include il testo duplicato, quindi dividiamo per 2
      const totalTextWidth = element.scrollWidth;
      const singleTextWidth = totalTextWidth / 2; // testo duplicato, quindi metà
      const containerWidth = container.clientWidth;

      if (singleTextWidth > containerWidth) {
        // Calcola la durata basata sulla distanza da percorrere (50% = un testo completo)
        // Velocità: circa 50px al secondo per una lettura confortevole
        const distance = singleTextWidth; // distanza da percorrere (un testo completo)
        const duration = distance / 50; // secondi
        setAnimationDuration(Math.max(3, Math.min(duration, 30))); // min 3s, max 30s
      } else {
        setAnimationDuration(6); // durata di default se non c'è overflow
      }
    };

    // Calcola dopo che l'elemento è renderizzato
    const timer = setTimeout(calculateDuration, 100);
    window.addEventListener('resize', calculateDuration);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateDuration);
    };
  }, [excerpt, isVisible]);

  const cls = (key) =>
    `${styles.cellInner} ${flags[key] ? styles.overflow : ""}`.trim();

  const RowWrapper = slug ? Link : "div";
  const rowProps = slug ? { href: `/projects/${slug}`, className: styles.row } : { className: styles.row };

  return (
    <RowWrapper 
      {...rowProps} 
      ref={rowRef}
      data-project-id={project?._id}
      className={`${rowProps.className || ''} ${isVisible ? styles.rowVisible : styles.rowAnimated}`.trim()}
    >
      <div className={`${styles.cell} ${styles.muted}`}>
        <div className={styles.orderCell}>
          <span className={styles.rowBullet} aria-hidden="true" />
          <span className={cls("order")} data-overflow-key="order">
            {orderFormatted !== "" ? `[${orderFormatted}]` : ""}
          </span>
        </div>
        {/* Nome del progetto su mobile - visibile solo su mobile */}
        <span className={`${cls("title")} ${styles.mobileTitle}`} data-overflow-key="title">
          {title}
        </span>
      </div>

      <div className={styles.cell}>
        <span className={cls("title")} data-overflow-key="title">
          {title}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.muted}`}>
        <span className={cls("categories")} data-overflow-key="categories">
          {categories}
        </span>
      </div>

      <div className={styles.cell}>
        <span className={cls("client")} data-overflow-key="client">
          {client}
        </span>
        {/* Client – Year su mobile */}
        <span className={styles.mobileClientYear}>
          {client && year ? `${client} – ${year}` : client || year}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.muted}`}>
        <span 
          ref={descRef}
          className={cls("excerpt")} 
          data-overflow-key="excerpt"
          style={{
            '--animation-duration': `${animationDuration}s`
          }}
        >
          {excerpt} {excerpt}
        </span>
      </div>

      <div className={`${styles.cell} ${styles.right}`}>
        <span className={cls("year")} data-overflow-key="year">
          {year}
        </span>
      </div>
    </RowWrapper>
  );
}


