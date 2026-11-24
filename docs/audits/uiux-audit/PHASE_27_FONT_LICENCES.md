# AUTOVERSE PHASE 27 — FONT LICENCES & ATTRIBUTION
**Date**: November 24, 2026  
**Document**: `docs/audits/uiux-audit/PHASE_27_FONT_LICENCES.md`  

---

## 1. APPROVED TYPOGRAPHY STACK & LICENSING

The Gran Turismo Workstation redesign utilizes three open-source typefaces. All three are distributed under the **SIL Open Font License, Version 1.1 (OFL-1.1)**, allowing royalty-free commercial and non-commercial bundling, web serving, modification, and redistribution.

| Typeface | Upstream Designer / Foundry | Primary Role in AutoVerse | Upstream Licence |
| :--- | :--- | :--- | :--- |
| **Chakra Petch** | Cadson Demak (Thailand) | Display headers, vehicle model badges, section titles | SIL OFL 1.1 |
| **Inter** | Rasmus Andersson | Core interface typography, labels, descriptions, inputs | SIL OFL 1.1 |
| **JetBrains Mono** | JetBrains (Philipp Nurullin, Konstantin Bulenkov) | Telemetry numbers, dimensions, CAD coordinates, tabular data | SIL OFL 1.1 |

---

## 2. UPSTREAM LICENCE TEXT (SIL OPEN FONT LICENSE v1.1)

```
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide development
of collaborative font projects, to support the font creation efforts of
academic and linguistic communities, and to provide a free and open framework in
which fonts may be shared and improved in partnership with others.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining a copy
of the Font Software, to use, study, copy, merge, embed, modify, redistribute,
and sell modified and unmodified copies of the Font Software, subject to the
following conditions:

1) Neither the Font Software nor any of its individual components, in Original
or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy contains
the above copyright notice and this license. These can be included either as
stand-alone text files, human-readable headers or in the appropriate
machine-readable metadata fields within text or binary files as long as those
fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font Name(s)
unless explicit written permission is granted by the corresponding Copyright
Holder. This restriction only applies to the primary font name as presented to
the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software
shall not be used to promote, endorse or advertise any Modified Version,
except to acknowledge the contribution(s) of the Copyright Holder(s) and the
Author(s) or with their explicit written permission.

5) The Font Software, modified or unmodified, in part or in whole, must be
distributed entirely under this license, and must not be distributed under
any other license. The requirement for fonts to remain under this license does
not apply to any document created using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT,
TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL,
INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT
SOFTWARE.
```

---

## 3. ASSET DELIVERY & OPTIMIZATION SPECIFICATION
- **Self-Hosting Mechanism**: Delivered via `@fontsource` modular npm packages.
- **Font Display Policy**: `font-display: swap` enforced in CSS to prevent FOIT (Flash of Invisible Text).
- **Subsetting**: Subset strictly to Latin characters to minimize network payload.
