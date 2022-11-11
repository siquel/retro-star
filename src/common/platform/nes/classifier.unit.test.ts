import { tryExtractGame } from './classifier'

describe('NES game classifier', () => {
  it.each`
    input                                       | expectedTitle
    ${'megaman'}                                | ${'Mega Man'}
    ${'megaman 5'}                              | ${'Mega Man 5'}
    ${'super mario bros / tetris'}              | ${'Super Mario Bros./Tetris/Nintendo World Cup'}
    ${'super mario duck hunt'}                  | ${'Super Mario Bros./Duck Hunt'}
    ${'super mario duck hunt world class meet'} | ${'Super Mario Bros./Duck Hunt/World Class Track Meet'}
    ${'complete mismatch'}                      | ${undefined}
    ${'super mario'}                            | ${'Super Mario Bros.'}
    ${'nfl'}                                    | ${'NFL Football'}
    ${'wizards & warriors'}                     | ${'Wizards & Warriors'}
    ${'wizards & warriors II'}                  | ${'Ironsword: Wizards & Warriors II'}
    ${'wizards & warriors III'}                 | ${'Wizards & Warriors III'}
    ${'mario bros'}                             | ${'Mario Bros.'}
    ${'super mario'}                            | ${'Super Mario Bros.'}
    ${'super mario 2'}                          | ${'Super Mario Bros. 2'}
    ${'super mario bros 2'}                     | ${'Super Mario Bros. 2'}
    ${'super mario 3'}                          | ${'Super Mario Bros. 3'}
    ${'super mario bros 3'}                     | ${'Super Mario Bros. 3'}
    ${'3d worldrunner'}                         | ${'The 3-D Battles of WorldRunner'}
    ${'lolo 3'}                                 | ${'Adventures of Lolo 3'}
    ${'Adventure island'}                       | ${'Adventure Island'}
    ${'Adventure island 2'}                     | ${'Adventure Island II'}
    ${'Adventure island II'}                    | ${'Adventure Island II'}
    ${'The Adventure Island Part 2'}            | ${'Adventure Island II'}
    ${'golf'}                                   | ${'Golf'}
    ${'nes open golf'}                          | ${'NES Open Tournament Golf'}
    ${'RC pro am'}                              | ${'R.C. Pro-Am'}
    ${'RC pro am ii'}                           | ${'R.C. Pro-Am II'}
    ${'söiderman return of the sinister'}       | ${'Spider-Man: Return of the Sinister Six'}
    ${'StarTropics'}                            | ${'StarTropics'}
    ${'StarTropics 2'}                          | ${"Zoda's Revenge: StarTropics II"}
    ${'StarTropics asd'}                        | ${'StarTropics'}
    ${'Star Tropics'}                           | ${'StarTropics'}
    ${'zelda'}                                  | ${'The Legend of Zelda'}
    ${'legend of zelda'}                        | ${'The Legend of Zelda'}
    ${'zelda 2'}                                | ${'Zelda II: The Adventure of Link'}
    ${'zelda II'}                               | ${'Zelda II: The Adventure of Link'}
    ${'short order'}                            | ${'Short Order/Eggsplode'}
    ${'eggsplode'}                              | ${'Short Order/Eggsplode'}
    ${'ohjain'}                                 | ${undefined}
    ${'soltice'}                                | ${'Solstice: The Quest for the Staff of Demnos'}
    ${'starsoldier'}                            | ${'Star Soldier'}
    ${'flintstones'}                            | ${'The Flintstones: The Rescue of Dino & Hoppy'}
    ${'flintstones surprise'}                   | ${'The Flintstones: Surprise at Dinosaur Peak'}
    ${''}                                       | ${undefined}
    ${'       '}                                | ${undefined}
    ${null}                                     | ${undefined}
    ${'Action 52'}                              | ${'Action 52'}
    ${'Super Spoke V’Ball'}                     | ${"Super Spike V'Ball"}
  `('returns "$expectedTitle" from "$input"', ({ input, expectedTitle }) => {
    expect(tryExtractGame(input)?.title).toBe(expectedTitle)
  })
})
