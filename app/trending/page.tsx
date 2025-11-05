"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Calendar, Star, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";

interface MenuItem {
  name: string;
  description: string;
  isVeg: boolean;
}

interface TiffinDay {
  id?: string;
  day: string;
  date: string;
  items: MenuItem[];
  isSpecial?: boolean;
  specialNote?: string;
  order?: number;
}

export default function TiffinShowcase() {
  const [tiffinDays, setTiffinDays] = useState<TiffinDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiffinDays();
  }, []);

  const fetchTiffinDays = async () => {
    try {
      const q = query(collection(db, "TiffinMenu"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const days: TiffinDay[] = [];
      querySnapshot.forEach((doc) => {
        days.push({
          id: doc.id,
          ...doc.data(),
        } as TiffinDay);
      });
      setTiffinDays(days);
    } catch (error) {
      console.error("Error fetching tiffin menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            This Week's Tiffin Menu
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Homemade meals delivered fresh to your doorstep. Healthy, delicious, and made with love.
          </p>
        </div>

        {tiffinDays.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No menu available at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiffinDays.map((tiffin, index) => (
              <Card
                key={tiffin.id || index}
                className={cn(
                  "group relative overflow-hidden border transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-1",
                  tiffin.isSpecial
                    ? "border-primary/50 bg-gradient-to-br from-primary/5 to-background"
                    : "border-border bg-card"
                )}
              >
                {tiffin.isSpecial && (
                  <div className="absolute right-0 top-0">
                    <div className="flex items-center gap-1 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" />
                      Special
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{tiffin.day}</h2>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {tiffin.date}
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  {tiffin.specialNote && (
                    <div className="mb-4 rounded-lg bg-primary/10 px-3 py-2">
                      <p className="text-xs font-medium text-primary">{tiffin.specialNote}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {tiffin.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="group/item flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-500">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{item.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <Badge variant="secondary" className="text-xs">
                      {tiffin.items.length} items
                    </Badge>
                    <span className="text-xs text-muted-foreground">100% Vegetarian</span>
                  </div>
                </div>

                <div
                  className={cn(
                    "absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent via-muted/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  )}
                />
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Subscribe to Our Tiffin Service
          </h3>
          <p className="mb-6 text-muted-foreground">
            Get fresh, homemade meals delivered daily. Choose from weekly or monthly plans.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="mr-2 h-4 w-4" />
              Delivered by 12 PM
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Star className="mr-2 h-4 w-4" />
              Fresh & Hygienic
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Homemade Taste
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}