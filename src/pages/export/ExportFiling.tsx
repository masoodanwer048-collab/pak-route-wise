import React from "react";
import { MainLayout } from '@/components/layout/MainLayout';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const exportFilingSchema = z.object({
  exporterName: z.string().min(1, "Exporter name is required"),
  exporterNTN: z.string().min(1, "NTN is required"),
  consigneeName: z.string().min(1, "Consignee name is required"),
  consigneeAddress: z.string().min(1, "Address is required"),
  itemDescription: z.string().min(1, "Item description is required"),
  hsCode: z.string().min(1, "HS Code is required"),
  quantity: z.string().min(1, "Quantity is required"),
  weight: z.string().min(1, "Weight is required"),
  destinationCountry: z.string().min(1, "Destination Country is required"),
  invoiceValue: z.string().min(1, "Invoice Value is required"),
});

type ExportFilingFormValues = z.infer<typeof exportFilingSchema>;

const ExportFiling = () => {
  const { toast } = useToast();
  const form = useForm<ExportFilingFormValues>({
    resolver: zodResolver(exportFilingSchema),
    defaultValues: {
      exporterName: "",
      exporterNTN: "",
      consigneeName: "",
      consigneeAddress: "",
      itemDescription: "",
      hsCode: "",
      quantity: "",
      weight: "",
      destinationCountry: "",
      invoiceValue: "",
    },
  });

  const onSubmit = (data: ExportFilingFormValues) => {
    console.log("Export Filing Data:", data);
    toast({
      title: "Export Filing Submitted",
      description: "The Goods Declaration has been successfully filed.",
    });
    form.reset();
  };

  return (
    <MainLayout title="Export Filing (GD)" subtitle="Submit your Goods Declaration for export.">
      <div className="space-y-6 animate-slide-up">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Exporter Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="exporterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exporter Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exporterNTN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NTN / Strn</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter NTN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-primary">Consignee Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="consigneeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignee Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter consignee name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="consigneeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">Shipment Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itemDescription"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Item Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe the goods" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hsCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HS Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Search HS Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter weight" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Value (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Filing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default ExportFiling;
