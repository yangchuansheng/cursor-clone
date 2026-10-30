import React from "react";
import { CursorFooter } from "./CursorFooter";
import { CursorHeader } from "./CursorHeader";
import { ProductTopSections } from "./product/ProductTopSections";
import { ProductMiddleSections } from "./product/ProductMiddleSections";
import { ProductBottomSections } from "./product/ProductBottomSections";

export function CursorProductPage() {
  return (
    <>
      <CursorHeader />
      <div className="section section--breadcrumb">
        <nav className="container">
          <ol className="flex items-center">
            <li>
              <span className="text-theme-text-sec" aria-current="page">
                Agents
              </span>
            </li>
          </ol>
        </nav>
      </div>
      <main id="main">
        <ProductTopSections />
        <ProductMiddleSections />
        <ProductBottomSections />
      </main>
      <CursorFooter />
    </>
  );
}
