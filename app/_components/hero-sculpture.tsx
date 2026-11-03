"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectLink } from "./project-transition";
import { projects } from "../_data/projects";
import Icon from "./icon";

export default function HeroSculpture() {
  const mount = useRef<HTMLDivElement>(null);
  const controls = useRef({ paused: false, alternate: false, x: 0, y: 0 });
  const wake = useRef(() => {});
  const capture = useRef<(() => string) | null>(null);
  const [paused, setPaused] = useState(false);
  const [alternate, setAlternate] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const host = mount.current;
    if (!host) return;

    async function createWorkspace() {
      const [THREE, { RoundedBoxGeometry }] = await Promise.all([
        import("three"), import("three/addons/geometries/RoundedBoxGeometry.js"),
      ]);
      const texture = await new THREE.TextureLoader().loadAsync("/projects/fixx-market/storefront.png");
      if (disposed || !host) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4.3, 4.3, 3.5, -3.5, .1, 50);
      camera.position.set(5, 4.2, 8.8);
      camera.lookAt(0, 1.4, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb5c6da, 2.7));
      const light = new THREE.DirectionalLight(0xffffff, 2.4);
      light.position.set(-3, 8, 5);
      scene.add(light);

      const device = new THREE.Group(); scene.add(device);
      const shell = new THREE.MeshStandardMaterial({ color: 0xe3eaf2, roughness: .62, metalness: .12 });
      const bezel = new THREE.MeshStandardMaterial({ color: 0x20324c, roughness: .8 });
      const keys = new THREE.MeshStandardMaterial({ color: 0xb9c7d9, roughness: .75 });
      const trackpad = new THREE.MeshStandardMaterial({ color: 0xcdd8e5, roughness: .7 });
      const base = new THREE.Mesh(new RoundedBoxGeometry(5.3, .15, 3.15, 3, .075), shell);
      base.position.y = .14; base.castShadow = true; base.receiveShadow = true; device.add(base);

      const lid = new THREE.Group(); lid.position.set(0, .2, -1.42); lid.rotation.x = -.12; device.add(lid);
      const back = new THREE.Mesh(new RoundedBoxGeometry(5.3, 3.25, .16, 3, .075), shell);
      back.position.y = 1.64; back.castShadow = true; lid.add(back);
      const frame = new THREE.Mesh(new RoundedBoxGeometry(5.13, 3.08, .04, 2, .02), bezel);
      frame.position.set(0, 1.65, .09); lid.add(frame);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.91, 2.77), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
      screen.position.set(0, 1.68, .116); lid.add(screen);
      const webcam = new THREE.Mesh(new THREE.CircleGeometry(.022, 12), keys);
      webcam.position.set(0, 3.135, .117); lid.add(webcam);

      const keyGeometry = new RoundedBoxGeometry(.31, .035, .24, 1, .012);
      for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 13; column++) {
          const key = new THREE.Mesh(keyGeometry, keys);
          key.position.set((column - 6) * .365, .235, -.95 + row * .33);
          device.add(key);
        }
      }
      const space = new THREE.Mesh(new RoundedBoxGeometry(1.8, .035, .2, 1, .012), keys);
      space.position.set(0, .235, .37); device.add(space);
      const pad = new THREE.Mesh(new RoundedBoxGeometry(1.7, .012, .67, 2, .006), trackpad);
      pad.position.set(0, .222, .96); device.add(pad);
      const shadowCanvas = document.createElement("canvas"); shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d");
      if (shadowContext) {
        const gradient = shadowContext.createRadialGradient(64, 64, 5, 64, 64, 64);
        gradient.addColorStop(0, "rgba(55,80,120,0.24)"); gradient.addColorStop(1, "rgba(55,80,120,0)");
        shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 128, 128);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 6), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -.12; scene.add(ground);

      let frameId = 0, previous = 0, elapsed = 0, visible = true;
      let scrollTarget = 0, scrollDepth = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const updateScroll = () => { scrollTarget = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * .85))); };
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        const aspect = width / Math.max(1, height);
        const halfWidth = 4.65;
        camera.left = -halfWidth; camera.right = halfWidth;
        camera.top = halfWidth / aspect; camera.bottom = -halfWidth / aspect;
        camera.updateProjectionMatrix(); renderer.setSize(width, height); renderer.render(scene, camera);
      };
      const render = (time: number) => {
        if (disposed) return;
        const delta = Math.min((time - previous) / 1000, .05); previous = time;
        const moving = !controls.current.paused && !reduced.matches;
        if (moving) elapsed += delta;
        const damping = 1 - Math.exp(-4.5 * delta);
        if (moving) scrollDepth += (scrollTarget - scrollDepth) * damping;
        else if (reduced.matches) scrollDepth = 0;
        const target = (controls.current.alternate ? -.72 : -.14) + scrollDepth * .18 + (moving ? controls.current.x * .12 + Math.sin(elapsed * .32) * .035 : 0);
        device.rotation.y += (target - device.rotation.y) * (reduced.matches ? 1 : damping);
        if (moving) {
          device.rotation.x += (controls.current.y * .025 + scrollDepth * .045 - device.rotation.x) * damping;
          device.position.y = Math.sin(elapsed * .7) * .025 + scrollDepth * .06;
          device.scale.setScalar(1 - scrollDepth * .025);
          lid.rotation.x = -.12 - scrollDepth * .05;
        } else if (reduced.matches) {
          device.rotation.x = 0; device.position.y = 0; device.scale.setScalar(1); lid.rotation.x = -.12;
        }
        renderer.render(scene, camera);
        if (visible && !document.hidden && (moving || Math.abs(target - device.rotation.y) > .001)) frameId = requestAnimationFrame(render);
      };
      const start = () => { cancelAnimationFrame(frameId); previous = performance.now(); if (visible && !document.hidden) frameId = requestAnimationFrame(render); };
      wake.current = start;
      // Capture in the same task as rendering, before WebGL clears its drawing buffer.
      capture.current = () => { renderer.render(scene, camera); return renderer.domElement.toDataURL("image/png"); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }, { rootMargin: "50px" });
      observer.observe(host);
      const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
      document.addEventListener("visibilitychange", start); reduced.addEventListener("change", start);
      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("resize", updateScroll);
      updateScroll(); resize(); setReady(true);
      cleanup = () => {
        wake.current = () => {}; capture.current = null; cancelAnimationFrame(frameId); observer.disconnect(); resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", start); reduced.removeEventListener("change", start);
        window.removeEventListener("scroll", updateScroll); window.removeEventListener("resize", updateScroll);
        const geometries = new Set<import("three").BufferGeometry>();
        const materials = new Set<import("three").Material>();
        scene.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); const meshMaterials = Array.isArray(object.material) ? object.material : [object.material]; meshMaterials.forEach(material => materials.add(material)); } });
        geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
        texture.dispose(); shadowTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }
    createWorkspace().catch(() => { if (!disposed) setReady(false); });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="workspace">
    <div className="workspace-top"><span className="tiny-label">Featured project</span><span className="workspace-live">01 / Web application</span></div>
    <div className="workspace-preview" onPointerMove={event => { const rect = event.currentTarget.getBoundingClientRect(); controls.current.x = (event.clientX - rect.left) / rect.width * 2 - 1; controls.current.y = (event.clientY - rect.top) / rect.height * 2 - 1; }} onPointerLeave={() => { controls.current.x = 0; controls.current.y = 0; }}>
      <ProjectLink project={projects[0]} getPreview={() => capture.current?.()}>
        <div className={`workspace-fallback ${ready ? "is-hidden" : ""}`} aria-hidden="true"><img src="/projects/fixx-market/storefront.png" alt="" width={1264} height={712} /></div>
        <div ref={mount} className="workspace-canvas" role="img" aria-label="A softly animated 3D laptop displaying the Fixx Market storefront" />
        <div className="workspace-caption"><span><strong>Fixx Market</strong><span className="tiny-label">Full-stack commerce</span></span><span className="workspace-open"><Icon size={20} /></span></div>
      </ProjectLink>
    </div>
    <div className="workspace-controls"><span>Click the preview to explore</span><div><button onClick={() => { controls.current.alternate = !alternate; setAlternate(!alternate); wake.current(); }} aria-pressed={alternate}>Rotate <span>↻</span></button><button className="motion-toggle" onClick={() => { controls.current.paused = !paused; setPaused(!paused); wake.current(); }} aria-pressed={paused} aria-label={paused ? "Play 3D animation" : "Pause 3D animation"}><Icon name={paused ? "play" : "pause"} size={13} /></button></div></div>
  </div>;
}
