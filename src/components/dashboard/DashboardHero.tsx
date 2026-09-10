"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

type DashboardHeroProps = {
  name: string;
  schemeCount: number;
};

export const DashboardHero = ({ name, schemeCount }: DashboardHeroProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card/90 backdrop-blur-[10px] border border-border shadow-eg-sm rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-eg-hover p-8 md:p-12 lg:col-span-2 flex flex-col justify-center items-center text-center md:items-start md:text-left">
      <h1 className="text-[48px] md:text-[64px] font-bold text-primary mb-2 leading-tight">
        {t('dashboard.hello')} <span className="italic">{name}</span>
      </h1>
      <p className="text-[18px] text-muted-foreground">
        {t('dashboard.schemesMatch', { count: schemeCount })}
      </p>
    </div>
  );
};
