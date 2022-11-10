export enum Platform {
  NES = 'NES',
  SNES = 'SNES',
  Nintendo64 = 'Nintendo64',
  NintendoGamecube = 'NintendoGamecube',
  NintendoWii = 'NintendoWii',
  NintendoWiiU = 'NintendoWiiU',
  Unknown = 'Unknown',
}

const NES_RE = /(\bNintendo 8-?bit\b|\b(?<!super\s*)NES\b|\bNintendo Entertaiment System\b)/i
const SNES_RE = /(\bSNES\b|\bSuper Nintendo\b|\bsuper nes\b)/i
const N64_RE = /(\bN64\b|\bNintendo\b \b64\b)/i
const GC_RE = /(\bNGC\b|\bGamecube\b)/i
// Note: negative lookahead match wii not followed by \s*U
const WII_RE = /\bwii(?!u|\s*u\b)/i
const WII_U_RE = /\bwii\s*u\b/i

const PLATFORM_REGEX_BY_PLATFORM: ReadonlyMap<Platform, RegExp> = new Map<Platform, RegExp>([
  [Platform.NES, NES_RE],
  [Platform.SNES, SNES_RE],
  [Platform.Nintendo64, N64_RE],
  [Platform.NintendoGamecube, GC_RE],
  [Platform.NintendoWii, WII_RE],
  [Platform.NintendoWiiU, WII_U_RE],
])

const composeRegexWithout = (platforms: Platform[]) => {
  const platformsAndRegexes = Array.from(PLATFORM_REGEX_BY_PLATFORM.entries()).filter(([p]) => !platforms.includes(p))
  if (platformsAndRegexes.length === 0) throw new Error('No platforms available to compose regex')

  return new RegExp(platformsAndRegexes.map(([, re]) => re.source).join('|'), 'gi')
}

const stripSymbols = (rawString: string) => {
  return rawString.replace(/[`~!@#$%^&*()_|+=?;:<>{}\[\]\\\/]/gi, '')
}

export const tryExtractPlatform = (rawString: string) => {
  const sanitized = stripSymbols(rawString)

  const parsePlatform = (sanitizedStr: string) => {
    const [platform] = Array.from(PLATFORM_REGEX_BY_PLATFORM).find(([, re]) => re.test(sanitizedStr)) ?? [
      Platform.Unknown,
      null,
    ]
    return platform
  }

  const platform = parsePlatform(sanitized)

  // If the source string contains multiple platforms, treat it as unknown for now.
  if (platform !== Platform.Unknown && composeRegexWithout([platform]).test(sanitized)) {
    return Platform.Unknown
  }

  return platform
}
