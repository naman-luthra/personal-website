"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { techStackItems } from "./techStackItems";

export default function Sculpture({ enabled }: { enabled: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const motion = useRef(enabled);
  const restart = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    motion.current = enabled;
    restart.current?.();
  }, [enabled]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const fallback = container.parentElement?.querySelector<HTMLElement>(
      ".tech-stack-fallback",
    );
    if (!fallback) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // The server-rendered SVG icons remain visible without WebGL.
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.25 : 1.5),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Pixel-based coordinates keep one canvas aligned with the responsive SVG fallback.
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
    camera.position.z = 600;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    const tileShape = new THREE.Shape();
    tileShape.moveTo(-0.34, -0.5);
    tileShape.lineTo(0.34, -0.5);
    tileShape.quadraticCurveTo(0.5, -0.5, 0.5, -0.34);
    tileShape.lineTo(0.5, 0.34);
    tileShape.quadraticCurveTo(0.5, 0.5, 0.34, 0.5);
    tileShape.lineTo(-0.34, 0.5);
    tileShape.quadraticCurveTo(-0.5, 0.5, -0.5, 0.34);
    tileShape.lineTo(-0.5, -0.34);
    tileShape.quadraticCurveTo(-0.5, -0.5, -0.34, -0.5);
    const tileGeometry = new THREE.ExtrudeGeometry(tileShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.015,
      bevelThickness: 0.015,
      steps: 1,
      curveSegments: 10,
    });
    tileGeometry.translate(0, 0, -0.09);
    const tileFace = new THREE.MeshPhysicalMaterial({
      color: 0x263342,
      metalness: 0.4,
      roughness: 0.32,
      clearcoat: 0.7,
    });
    const tileEdge = new THREE.MeshPhysicalMaterial({
      color: 0x506780,
      metalness: 0.7,
      roughness: 0.3,
    });

    const loader = new SVGLoader();
    const icons = techStackItems.flatMap((item, index) => {
      const anchor = fallback.querySelector<HTMLElement>(
        `[data-tech="${item.id}"]`,
      );
      const svg = anchor?.querySelector("svg");
      if (!anchor || !svg) return [];
      // The exact same SVG paths power the fallback and the raised 3D logo.
      const shapes = loader
        .parse(svg.outerHTML.replaceAll("currentColor", item.color))
        .paths.flatMap((path) => SVGLoader.createShapes(path));
      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 1.2,
        bevelEnabled: true,
        bevelSize: 0.06,
        bevelThickness: 0.1,
        bevelSegments: 2,
        steps: 1,
        curveSegments: 10,
      });
      geometry.center();
      geometry.computeBoundingBox();
      const bounds = geometry.boundingBox!.getSize(new THREE.Vector3());
      const scale =
        (item.id === "go" ? 0.78 : 0.64) / Math.max(bounds.x, bounds.y);
      geometry.scale(scale, scale, scale);
      const face = new THREE.MeshPhysicalMaterial({
        color: item.color,
        metalness: 0.35,
        roughness: 0.27,
        clearcoat: 0.8,
      });
      const edge = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color).multiplyScalar(0.45),
        metalness: 0.45,
        roughness: 0.3,
      });
      const logo = new THREE.Mesh(geometry, [face, edge]);
      // SVG y increases downward. Reflect the mesh, preserving correct face winding.
      logo.scale.y = -1;
      logo.position.z = 0.05;
      const group = new THREE.Group();
      group.add(new THREE.Mesh(tileGeometry, [tileFace, tileEdge]), logo);
      scene.add(group);
      return [
        {
          group,
          anchor,
          x: 0,
          y: 0,
          phase: index * 1.7,
          tilt: THREE.MathUtils.degToRad(-item.tilt),
          turn: index % 2 ? 0.26 : -0.3,
        },
      ];
    });

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(-300, 500, 600);
    const rim = new THREE.DirectionalLight(0x70b5f5, 1.5);
    rim.position.set(300, -200, 200);
    scene.add(ambient, key, rim);

    const pointer = new THREE.Vector2();
    let frame = 0;
    let time = 0;
    let lastTime = 0;
    let visible = true;
    let scroll = 0;
    let disposed = false;
    const draw = (now = performance.now()) => {
      if (disposed) return;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      if (motion.current) time += delta;
      icons.forEach(({ group, x, y, phase, tilt, turn }) => {
        const targetX =
          0.18 + (motion.current ? pointer.y * 0.1 + scroll * 0.06 : 0);
        const targetY =
          turn +
          (motion.current
            ? pointer.x * 0.16 + Math.sin(time * 0.45 + phase) * 0.05
            : 0);
        group.rotation.x = motion.current
          ? THREE.MathUtils.lerp(group.rotation.x, targetX, 0.06)
          : targetX;
        group.rotation.y = motion.current
          ? THREE.MathUtils.lerp(group.rotation.y, targetY, 0.06)
          : targetY;
        group.rotation.z =
          tilt + (motion.current ? Math.sin(time * 0.35 + phase) * 0.025 : 0);
        group.position.set(
          x,
          y + (motion.current ? Math.sin(time * 0.7 + phase) * 3 : 0),
          0,
        );
      });
      renderer.render(scene, camera);
      if (visible && motion.current && !document.hidden)
        frame = requestAnimationFrame(draw);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      lastTime = 0;
      draw();
    };
    restart.current = start;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      icons.forEach((icon) => {
        icon.x = fallback.offsetLeft + icon.anchor.offsetLeft - width / 2;
        icon.y = height / 2 - fallback.offsetTop - icon.anchor.offsetTop;
        icon.group.scale.setScalar(icon.anchor.offsetWidth);
      });
      start();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        start();
      },
      { rootMargin: "100px" },
    );
    visibilityObserver.observe(container);
    const onPointer = (event: PointerEvent) => {
      if (!motion.current || event.pointerType === "touch") return;
      pointer.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        (event.clientY / window.innerHeight - 0.5) * 2,
      );
    };
    const onScroll = () => {
      scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      setReady(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", start);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    setReady(true);

    return () => {
      disposed = true;
      restart.current = null;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("scroll", onScroll);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          geometries.add(object.geometry);
          const values = Array.isArray(object.material)
            ? object.material
            : [object.material];
          values.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      className={`sculpture-canvas ${ready ? "is-ready" : ""}`}
      data-shape="tech-stack"
      aria-hidden="true"
    />
  );
}
