export default function RoomDetails({ details }) {
  return (
    <div className="space-y-4 rounded-xl bg-input p-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-3xl font-black">Status</h3>
          <p className="text-2xl">For Rent</p>
        </div>
        <div>
          <h3 className="text-3xl font-black">Capacity</h3>
          <p className="text-2xl">Up to 4 tenants</p>
        </div>
      </div>
      <p className="text-2xl">
        <span className="block text-3xl font-black">Rent</span>₱ {details.room_rent}
      </p>
      <p className="text-2xl">
        <span className="block text-3xl font-black">About the room</span>
        Visitors allowed <br />
        Inclusive of Utility Bills <br />
        Curfew <br />
        Fully Furnished
      </p>
    </div>
  );
}
