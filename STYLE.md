# BeigeSocks style

The look comes from the four home page pictures: tube-sock beige, the red-and-white
sweatband stripe, and marker doodles drawn over real photos. Keep it that simple.

## Colors

| Name       | Hex       | Tailwind      | Use                                   |
|------------|-----------|---------------|---------------------------------------|
| Paper      | `#F6F1E7` | `paper`       | Page background                       |
| Sock       | `#EEE4D2` | `sock`        | Light fills, hover backgrounds        |
| Cream      | `#FFFBF3` | `cream`       | Cards, header, inputs                 |
| Band red   | `#D8401F` | `band`        | The stripe, buttons, checked boxes    |
| Band dark  | `#B3321A` | `band-dark`   | Hover on red, small red text          |
| Ink        | `#2A2420` | `ink`         | Text                                  |
| Ink soft   | `#6F655A` | `ink-soft`    | Secondary text, placeholders          |
| Line       | `#E2D7C3` | `line`        | Borders                               |

Status colors (green "have", amber "order") stay as they are in Workbench.

## Rules

1. **Anything you can click into gets the sweatband.** Use `.band-card` for cards (stripe
   along the top edge) and `.band-pill` for labels and tabs (cream pill, red line top and
   bottom). Every page has the stripe across the top of the header.
2. **Every section has its own sweatband creature.** The pigeon is Trips. New sections
   need a new doodled photo before they get a home page tile.
3. **Buttons are pills.** Red with cream text for the main action, cream with a line
   border for everything else.
4. **Headings are heavy and tight** (`font-extrabold tracking-tight`). No custom fonts yet.
5. **Rounded, soft corners** (`rounded-2xl` cards, `rounded-full` buttons).

## Not yet decided

The other three home page tiles.
