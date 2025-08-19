import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";

const orderItems = [
  {
    id: 1,
    name: "Fun Dinosaur Activity Worksheets (Ages 3–4)",
    image: "/api/placeholder/251/167",
    quantity: 1,
    price: 79,
  },
  {
    id: 2,
    name: "Let's Learn Time! – Fun Clock Activity Pack (Ages 3–6)",
    image: "/api/placeholder/238/238",
    quantity: 1,
    price: 89,
  },
];
export default function Desktop() {
  return (
    <div className="bg-white min-h-screen w-full">
      {" "}
      {/* Header */}{" "}
      <header className="w-full">
        {" "}
        {/* Top bar */}{" "}
        <div className="h-10 bg-variable-collection-secondary w-full">
          {" "}
          <div className="flex justify-end items-center h-full px-6 gap-6">
            {" "}
            <span className="font-m3-headline-small-emphasized font-[number:var(--m3-headline-small-emphasized-font-weight)] text-backgrounf text-[length:var(--m3-headline-small-emphasized-font-size)] tracking-[var(--m3-headline-small-emphasized-letter-spacing)] leading-[var(--m3-headline-small-emphasized-line-height)] [font-style:var(--m3-headline-small-emphasized-font-style)]">
              {" "}
              Help{" "}
            </span>{" "}
            <span className="font-m3-headline-small-emphasized font-[number:var(--m3-headline-small-emphasized-font-weight)] text-backgrounf text-[length:var(--m3-headline-small-emphasized-font-size)] tracking-[var(--m3-headline-small-emphasized-letter-spacing)] leading-[var(--m3-headline-small-emphasized-line-height)] [font-style:var(--m3-headline-small-emphasized-font-style)]">
              {" "}
              Sign Up{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* Main header */}{" "}
        <div className="h-[106px] bg-backgrounf w-full">
          {" "}
          <div className="flex items-center justify-between px-6 h-full">
            {" "}
            {/* Logo */}{" "}
            <div className="flex items-center">
              {" "}
              <img
                src=""
                alt="Baby Club Logo"
                className="w-[75px] h-[62px]"
              />{" "}
            </div>{" "}
            {/* Navigation */}{" "}
            <nav className="flex items-center gap-8 bg-white px-4 py-3">
              {" "}
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  className="font-m3-headline-small font-[number:var(--m3-headline-small-font-weight)] text-variable-collection-primary text-[length:var(--m3-headline-small-font-size)] tracking-[var(--m3-headline-small-letter-spacing)] leading-[var(--m3-headline-small-line-height)] [font-style:var(--m3-headline-small-font-style)] hover:opacity-80"
                >
                  {" "}
                  {item.label}{" "}
                </button>
              ))}{" "}
            </nav>{" "}
            {/* Search and icons */}{" "}
            <div className="flex items-center gap-4">
              {" "}
              <div className="relative">
                {" "}
                <Input
                  placeholder="Search"
                  className="w-[365px] h-[50px] bg-white rounded-[20px] shadow-[0px_2px_2px_#00000040] pl-12"
                />{" "}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />{" "}
              </div>{" "}
              <ShoppingCart className="w-[30px] h-[30px] text-gray-600" />{" "}
              <User className="w-[30px] h-[30px] text-gray-600" />{" "}
              <Heart className="w-[30px] h-[30px] text-gray-600" />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      {/* Success banner */}{" "}
      <div className="w-full h-[117px] bg-backgrounf">
        {" "}
        <div className="flex items-center justify-between px-[314px] h-full">
          {" "}
          <Button
            variant="outline"
            className="h-auto flex items-center gap-2 px-6 py-3"
          >
            {" "}
            <ArrowLeft className="w-5 h-5" />{" "}
            <span className="font-components-button font-[number:var(--components-button-font-weight)] text-[length:var(--components-button-font-size)] tracking-[var(--components-button-letter-spacing)] leading-[var(--components-button-line-height)] [font-style:var(--components-button-font-style)]">
              {" "}
              Back to shop{" "}
            </span>{" "}
          </Button>{" "}
          <h1 className="font-m3-display-medium-emphasized font-[number:var(--m3-display-medium-emphasized-font-weight)] text-[#406fc2] text-[length:var(--m3-display-medium-emphasized-font-size)] tracking-[var(--m3-display-medium-emphasized-letter-spacing)] leading-[var(--m3-display-medium-emphasized-line-height)] [font-style:var(--m3-display-medium-emphasized-font-style)]">
            {" "}
            Payment Successful!{" "}
          </h1>{" "}
          <h2 className="font-m3-display-medium-emphasized font-[number:var(--m3-display-medium-emphasized-font-weight)] text-[#406fc2] text-[length:var(--m3-display-medium-emphasized-font-size)] tracking-[var(--m3-display-medium-emphasized-letter-spacing)] leading-[var(--m3-display-medium-emphasized-line-height)] [font-style:var(--m3-display-medium-emphasized-font-style)]">
            {" "}
            Your Order{" "}
          </h2>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main content */}{" "}
      <main className="flex px-6 py-8 gap-8">
        {" "}
        {/* Left side - Thank you section */}{" "}
        <div className="flex-1">
          {" "}
          <h2 className="font-m3-headline-large-emphasized font-[number:var(--m3-headline-large-emphasized-font-weight)] text-[#406fc2] text-[length:var(--m3-headline-large-emphasized-font-size)] tracking-[var(--m3-headline-large-emphasized-letter-spacing)] leading-[var(--m3-headline-large-emphasized-line-height)] [font-style:var(--m3-headline-large-emphasized-font-style)] mb-8">
            {" "}
            Thank you for your purchase{" "}
          </h2>{" "}
          {/* Download illustration */}{" "}
          <Card className="w-[576px] h-[382px] mb-8">
            {" "}
            <CardContent className="flex items-center justify-center h-full">
              {" "}
              <img
                src=""
                alt="Download illustration"
                className="w-full h-full object-contain"
              />{" "}
            </CardContent>{" "}
          </Card>{" "}
          {/* Download status */}{" "}
          <div className="space-y-4">
            {" "}
            <h3 className="font-m3-headline-large-emphasized font-[number:var(--m3-headline-large-emphasized-font-weight)] text-black text-[length:var(--m3-headline-large-emphasized-font-size)] tracking-[var(--m3-headline-large-emphasized-letter-spacing)] leading-[var(--m3-headline-large-emphasized-line-height)] [font-style:var(--m3-headline-large-emphasized-font-style)]">
              {" "}
              Your file is downloading...{" "}
            </h3>{" "}
            <p className="font-m3-headline-medium font-[number:var(--m3-headline-medium-font-weight)] text-black text-[length:var(--m3-headline-medium-font-size)] tracking-[var(--m3-headline-medium-letter-spacing)] leading-[var(--m3-headline-medium-line-height)] [font-style:var(--m3-headline-medium-font-style)]">
              {" "}
              ✅ Auto-download started (or [click here]){" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right side - Order details */}{" "}
        <div className="w-[895px]">
          {" "}
          <div className="flex justify-between items-center mb-4">
            {" "}
            <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-[#a0a0a0] text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
              {" "}
              Order No: 202507001{" "}
            </span>{" "}
            <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-[#a0a0a0] text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
              {" "}
              Order Date: July 9, 2025 12:30 hrs.{" "}
            </span>{" "}
          </div>{" "}
          <Card>
            {" "}
            <CardContent className="p-6">
              {" "}
              {/* Header */}{" "}
              <div className="flex justify-between items-center mb-4">
                {" "}
                <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                  {" "}
                  Your Item:{" "}
                </span>{" "}
                <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                  {" "}
                  Price (THB.){" "}
                </span>{" "}
              </div>{" "}
              <Separator className="mb-6" /> {/* Order items */}{" "}
              <div className="space-y-8">
                {" "}
                {orderItems.map((item, index) => (
                  <div key={item.id}>
                    {" "}
                    <div className="flex items-start gap-6">
                      {" "}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-[251px] h-[167px] object-cover rounded"
                      />{" "}
                      <div className="flex-1">
                        {" "}
                        <h4 className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)] mb-4">
                          {" "}
                          "{item.name}"{" "}
                        </h4>{" "}
                      </div>{" "}
                      <div className="text-right space-y-2">
                        {" "}
                        <div className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                          {" "}
                          {item.quantity} item{" "}
                        </div>{" "}
                        <div className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                          {" "}
                          {item.price}{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    {index < orderItems.length - 1 && (
                      <Separator className="mt-8" />
                    )}{" "}
                  </div>
                ))}{" "}
              </div>{" "}
              <Separator className="my-6" /> {/* Total */}{" "}
              <div className="flex justify-between items-center">
                {" "}
                <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                  {" "}
                  Total{" "}
                </span>{" "}
                <span className="font-m3-title-large font-[number:var(--m3-title-large-font-weight)] text-black text-[length:var(--m3-title-large-font-size)] tracking-[var(--m3-title-large-letter-spacing)] leading-[var(--m3-title-large-line-height)] [font-style:var(--m3-title-large-font-style)]">
                  {" "}
                  168{" "}
                </span>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </main>{" "}
      {/* Footer */}{" "}
      <footer className="w-full h-[216px] bg-[#d9d9d9] flex items-center justify-center">
        {" "}
        <h2 className="font-m3-display-medium-emphasized font-[number:var(--m3-display-medium-emphasized-font-weight)] text-black text-[length:var(--m3-display-medium-emphasized-font-size)] tracking-[var(--m3-display-medium-emphasized-letter-spacing)] leading-[var(--m3-display-medium-emphasized-line-height)] [font-style:var(--m3-display-medium-emphasized-font-style)]">
          {" "}
          Products YOU MAY BE INTERESTED IN!{" "}
        </h2>{" "}
      </footer>{" "}
    </div>
  );
}
