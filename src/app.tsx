import { AttendeeList } from "./componetes/attendee-list";
import { Header } from "./componetes/header";

export function App() {
  return (
    <div className='max-w-[1256px] mx-auto py-5 flex flex-col gap-5'>
      <Header />
      <AttendeeList />
    </div>
  )
}