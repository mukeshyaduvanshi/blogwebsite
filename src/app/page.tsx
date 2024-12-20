"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComponentData {
  id: string;
  type: "title" | "quote" | "text" | "image" | "list" | "table" | "html";
  content: string;
}

const htmlTags = [
  { value: "title", label: "Title (h2)" },
  { value: "quote", label: "Quote (blockquote)" },
  { value: "text", label: "Text (p)" },
  { value: "image", label: "Image (img)" },
  { value: "list", label: "Unordered List (ul)" },
  { value: "table", label: "Table" },
  { value: "html", label: "Custom HTML" },
];

export default function EditableComponentsDemo() {
  const [components, setComponents] = useState<ComponentData[]>([
    { id: "title", type: "title", content: "Overview of Arm Lift Surgery" },
    {
      id: "quote",
      type: "quote",
      content:
        "An arm lift, or brachioplasty, is a cosmetic procedure designed to remove excess skin and fat from the upper arms, resulting in a more toned and contoured appearance.",
    },
    {
      id: "text1",
      type: "text",
      content:
        "Healthcation partners with highly skilled surgeons in top medical destinations to provide high-quality, affordable arm lift surgeries.",
    },
    {
      id: "image1",
      type: "image",
      content: "https://example.com/arm-lift.jpg",
    },
    {
      id: "list1",
      type: "list",
      content:
        "Improved arm contour\nReduced excess skin\nEnhanced self-confidence",
    },
    {
      id: "table1",
      type: "table",
      content: "Procedure,Duration,Recovery Time\nArm Lift,2-3 hours,2-3 weeks",
    },
    {
      id: "html1",
      type: "html",
      content:
        '<div class="custom-content"><span style="color: blue;">Custom</span> HTML content</div>',
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [newItemType, setNewItemType] = useState<ComponentData["type"]>("text");

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditedContent(content);
  };

  const handleSave = () => {
    setComponents(
      components.map((component) =>
        component.id === editingId
          ? { ...component, content: editedContent }
          : component
      )
    );
    setEditingId(null);
  };

  const handleAddRow = (component: ComponentData) => {
    if (component.type === "table") {
      const [headers, ...rows] = component.content
        .split("\n")
        .map((row) => row.split(","));
      const newRow = Array(headers.length).fill("");
      const newContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
        newRow.join(","),
      ].join("\n");
      setComponents(
        components.map((c) =>
          c.id === component.id ? { ...c, content: newContent } : c
        )
      );
      setEditedContent(newContent);
    }
  };

  const handleAddNewItem = () => {
    const newId = `${newItemType}${components.length + 1}`;
    setComponents([
      ...components,
      { id: newId, type: newItemType, content: "" },
    ]);
    setEditingId(newId);
    setEditedContent("");
  };

  const handleDelete = (id: string) => {
    setComponents(components.filter((component) => component.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const renderComponent = (component: ComponentData) => {
    switch (component.type) {
      case "title":
        return (
          <h2 className="text-2xl font-semibold mb-4">{component.content}</h2>
        );
      case "quote":
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
            {component.content}
          </blockquote>
        );
      case "text":
        return <p className="mb-4">{component.content}</p>;
      case "image":
        return (
          <img
            src={component.content}
            alt="Content"
            className="max-w-full h-auto mb-4 rounded-lg shadow-md"
          />
        );
      case "list":
        return (
          <ul className="list-disc pl-5 mb-4">
            {component.content.split("\n").map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        );
      case "table":
        const [headers, ...rows] = component.content
          .split("\n")
          .map((row) => row.split(","));
        return (
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "html":
        return (
          <div
            dangerouslySetInnerHTML={{ __html: component.content }}
            className="mb-4"
          />
        );
      default:
        return null;
    }
  };

  const renderEditForm = (component: ComponentData) => {
    if (component.type === "table") {
      const [headers, ...rows] = component.content
        .split("\n")
        .map((row) => row.split(","));
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {headers.map((header, index) => (
              <Input
                key={index}
                value={header}
                onChange={(e) => {
                  const newHeaders = [...headers];
                  newHeaders[index] = e.target.value;
                  const newContent = [
                    newHeaders.join(","),
                    ...rows.map((row) => row.join(",")),
                  ].join("\n");
                  setEditedContent(newContent);
                  setComponents(
                    components.map((c) =>
                      c.id === component.id ? { ...c, content: newContent } : c
                    )
                  );
                }}
                placeholder={`Header ${index + 1}`}
              />
            ))}
          </div>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((cell, cellIndex) => (
                <Input
                  key={cellIndex}
                  value={cell}
                  onChange={(e) => {
                    const newRows = [...rows];
                    newRows[rowIndex][cellIndex] = e.target.value;
                    const newContent = [
                      headers.join(","),
                      ...newRows.map((r) => r.join(",")),
                    ].join("\n");
                    setEditedContent(newContent);
                    setComponents(
                      components.map((c) =>
                        c.id === component.id
                          ? { ...c, content: newContent }
                          : c
                      )
                    );
                  }}
                  placeholder={`Row ${rowIndex + 1}, Cell ${cellIndex + 1}`}
                />
              ))}
            </div>
          ))}
          <Button onClick={() => handleAddRow(component)}>Add Row</Button>
        </div>
      );
    } else {
      return (
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full mb-2"
          rows={5}
        />
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Editable Components Demo</h1>
      {components.map((component) => (
        <Card key={component.id} className="mb-6">
          <CardContent className="p-6">
            {editingId === component.id ? (
              <>
                {renderEditForm(component)}
                <div className="flex gap-2 mt-4">
                  {component.type !== "table" && (
                    <Button onClick={handleSave}>Save</Button>
                  )}
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {renderComponent(component)}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(component.id, component.content)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(component.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Item</h3>
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={newItemType}
              onValueChange={(value) =>
                setNewItemType(value as ComponentData["type"])
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {htmlTags.map((tag) => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddNewItem}>Add New Item</Button>
          </div>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-bold mt-8 mb-4">Preview</h2>
      <Card>
        <CardContent className="p-6">
          {components.map((component) => (
            <React.Fragment key={component.id}>
              {renderComponent(component)}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
