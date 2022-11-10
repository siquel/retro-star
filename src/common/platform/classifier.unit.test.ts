import { Platform, tryExtractPlatform } from './classifier'

describe('Classifier', () => {
  it.each`
    source                                                           | expected
    ${"Nintendo 64: Yoshi's Story - N64"}                            | ${Platform.Nintendo64}
    ${'Gradius NES'}                                                 | ${Platform.NES}
    ${'World Cup 98 Nintendo 64'}                                    | ${Platform.Nintendo64}
    ${'Carmageddon Nintendo 64 N64'}                                 | ${Platform.Nintendo64}
    ${'DuckTales nes EEC-SCN'}                                       | ${Platform.NES}
    ${"Zelda - A link to the past Player's Guide"}                   | ${Platform.Unknown}
    ${'Nintendo 8-bit - Street fighter 2010 the final fight, USA'}   | ${Platform.NES}
    ${'Nintendo NES 8bit Knight Rider (L) USA'}                      | ${Platform.NES}
    ${'Faxanadu SCN (Boxed)'}                                        | ${Platform.Unknown}
    ${'Batman: Return of the Joker SCN'}                             | ${Platform.Unknown}
    ${'Resident evil umbrella chronicles wii pal!'}                  | ${Platform.NintendoWii}
    ${'Fast Racing Neo Wii U'}                                       | ${Platform.NintendoWiiU}
    ${'Fire Emblem Path of Radiance ja Radiant Dawn Wii / Gamecube'} | ${Platform.Unknown}
    ${'NES SNES NGC'}                                                | ${Platform.Unknown}
    ${'Nintendo Gamecube peli Super Mario Sunshine NGC'}             | ${Platform.NintendoGamecube}
    ${'NGC Worms Blast cib'}                                         | ${Platform.NintendoGamecube}
    ${'Shrek 2 Nintendo Gamecube'}                                   | ${Platform.NintendoGamecube}
    ${'Resident Evil 3 Gamecube'}                                    | ${Platform.NintendoGamecube}
    ${'Stunt race. FX super nintendo'}                               | ${Platform.SNES}
    ${'wii uber racing'}                                             | ${Platform.NintendoWii}
    ${'wiiu foobar'}                                                 | ${Platform.NintendoWiiU}
    ${'wiiusa not a platform'}                                       | ${Platform.Unknown}
    ${'wii usa is a platform'}                                       | ${Platform.NintendoWii}
    ${'[NGC] Frogger Beyond'}                                        | ${Platform.NintendoGamecube}
    ${'Castlevania 3 NES!'}                                          | ${Platform.NES}
    ${'Nintendo Scope 6 - Super Nes'}                                | ${Platform.SNES}
  `('extracts platform from "$source" to be $expected', ({ source, expected }) => {
    expect(tryExtractPlatform(source)).toBe(expected)
  })
})
