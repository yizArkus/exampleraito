import { IconoManoFlecha, type IconoManoFlechaProps } from './IconoManoFlecha';

export type ManoFlechaIconProps = Omit<IconoManoFlechaProps, 'color'> & {
  /** @deprecated Usa `color` en `IconoManoFlecha`. */
  handColor?: string;
  color?: string;
};

/** Alias del ícono vectorial; `handColor` se mapea a `color`. */
export function ManoFlechaIcon({ handColor, color, ...rest }: ManoFlechaIconProps) {
  const resolved = handColor ?? color;
  return <IconoManoFlecha {...rest} {...(resolved !== undefined ? { color: resolved } : {})} />;
}
