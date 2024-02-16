import { Carousel, CarouselButton, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function TenantCarousel({ tenants }) {
  function formatDate(timestamp) {
    return timestamp.toDate().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Carousel className="mb-8 max-w-xl rounded-xl bg-input p-4">
      <CarouselContent>
        {tenants.map((tenant, index) => (
          <CarouselItem key={index}>
            {/* personal info */}
            <div className="space-y-4 ">
              <div>
                <h2 className="text-5xl font-black">{tenant.name}</h2>
                <p className="text-2xl">{tenant.email}</p>
                <p className="text-2xl">{tenant.sex}</p>
              </div>
              {/* contact numbers */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-black">Contact</h3>
                  <p className="text-2xl">{tenant.contact_num}</p>
                  <p className="text-2xl">
                    {tenant.alt_contact_num === "" ? "--------------" : tenant.alt_contact_num}
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-black">Emergency</h3>
                  <p className="text-2xl">{tenant.emergency_num}</p>
                  <p className="text-2xl">
                    {tenant.alt_emergency_num === "" ? "--------------" : tenant.alt_emergency_num}
                  </p>
                </div>
              </div>
              <p className="text-2xl">
                <span className="block text-3xl font-black">Tenant since: </span>
                {formatDate(tenant.date_joined)}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* navigation buttons */}
      <div className="absolute -bottom-10 left-1/2 w-fit -translate-x-1/2 space-x-8">
        {tenants.map((_, index) => (
          <CarouselButton key={index} index={index} />
        ))}
      </div>
    </Carousel>
  );
}
