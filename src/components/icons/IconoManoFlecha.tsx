import type { CSSProperties } from 'react';

export type IconoManoFlechaProps = {
  /** Lado del viewBox en px (el gráfico escala de forma vectorial). */
  size?: number;
  className?: string;
  /** Verde mano (referencia image_2: ~#76BA43 / #69B342). */
  color?: string;
  /** Flecha interior. */
  arrowColor?: string;
  /** Accesible cuando el ícono no es solo decorativo. */
  title?: string;
};

/**
 * Silueta: pulgar arriba + cuatro dedos horizontales; flecha negra en la palma.
 * Geometría 100×100; sin fondo (solo paths con fill).
 */
const HAND_PATH =
  'M18 92 18 56C16 28 22 8 34 8 42 8 46 14 46 22L47 26 52 20 76 18Q82 18 82 22Q82 26 76 26L52 28 52 32 80 32Q86 32 86 36Q86 40 80 40L52 40 52 44 80 44Q86 44 86 48Q86 52 80 52L52 52 52 56 76 56Q82 56 82 60Q82 64 76 64L52 66 52 88 22 88 18 92z';

const ARROW_PATH = 'M5 90 9 86 42 48 48 42 44 38 3 88z';

/**
 * Ícono vectorial mano + flecha. Transparente por definición; escala sin pérdida
 * (`viewBox` + ancho/alto iguales). Usa `display:block` para evitar hueco baselines.
 */
export function IconoManoFlecha({
  size = 100,
  className,
  color = '#76BA43',
  arrowColor = '#000000',
  title,
}: IconoManoFlechaProps) {
  const decorative = title === undefined || title === '';
  const svgStyle: CSSProperties = {
    display: 'block',
    flexShrink: 0,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={svgStyle}
      preserveAspectRatio="xMidYMid meet"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      <path fill={color} d={HAND_PATH} />
      <path fill={arrowColor} d={ARROW_PATH} />
    </svg>
  );
}
