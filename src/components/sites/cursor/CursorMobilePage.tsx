import React from "react";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import { MobileHeroAndLocalCloud } from "./mobile/MobileHeroAndLocalCloud";
import { MobileLifecycleAndBottom } from "./mobile/MobileLifecycleAndBottom";

export function CursorMobilePage() {
  return (
    <>
      <CursorHeader />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              '{"@context":"https://schema.org","@type":"MobileApplication","name":"Cursor"}',
          }}
        />
        <MobileHeroAndLocalCloud />
        <MobileLifecycleAndBottom />
      </main>
      <CursorFooter />
    </>
  );
}
