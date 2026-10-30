import React from "react";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import { CloudHeroAndLogos } from "./cloud/CloudHeroAndLogos";
import { CloudSurfacesAndAutomations } from "./cloud/CloudSurfacesAndAutomations";
import { CloudMergeAndBottom } from "./cloud/CloudMergeAndBottom";

export function CursorCloudPage() {
  return (
    <>
      <CursorHeader />
      <div className="section section--breadcrumb">
        <nav className="container">
          <ol className="flex items-center">
            <li>
              <span className="text-theme-text-sec" aria-current="page">
                Cloud
              </span>
            </li>
          </ol>
        </nav>
      </div>
      <main id="main">
        <CloudHeroAndLogos />
        <CloudSurfacesAndAutomations />
        <CloudMergeAndBottom />
      </main>
      <CursorFooter />
    </>
  );
}
