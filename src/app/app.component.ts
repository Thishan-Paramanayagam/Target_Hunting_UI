import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { Candidate } from './models/candidate';
import { CandidateService } from './service/candidate.service';
import { TimeAvailabilityService } from './service/time-availability.service';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'Target_Hunting';
  // Initialize with a default value
  selectedDate: string = "";
  originalCandidates: Candidate[] = [];
  selectedTime: string = "";
  
  currentPage: number = 1; // Current page number
pageSize: number = 5; // limit to 5
  Candidateary : Candidate[] = [];
  selectedSortMethod: string = 'name-asc';
Candidateformgroup : FormGroup;
  

 constructor(private cndservice:CandidateService,private fb:FormBuilder,private timeservice:TimeAvailabilityService) {
  this.Candidateformgroup = this.fb.group({
    id: [""],
    name: ["", Validators.required],
    mobileNo: ["", [Validators.required, Validators.pattern('^[0-9]+$')]],
    email: ["", Validators.required],
    position: ["", Validators.required],
    date: ["", Validators.required],
     time: ["", Validators.required],
    
  })
}

ngOnInit(): void {
  
  this.getcandidatess(); 
  this.populateTimeSlots();
  this.selectedTime = this.timeSlots[0];
}

//get all candidates details function
getcandidatess(){
  this.cndservice.GetCandidate().subscribe(response =>{
    this.Candidateary = response
    console.log(response);
    this.sortCandidates();
    this.filteredCandidates = []; // Clear the filtered candidates array
  this.originalCandidates = this.Candidateary.slice();
  });
}

//Onsubmitting form function
OnSubmit(){
  const requiredFields = ['name', 'mobileNo', 'email','position', 'date', 'time'];
  const emptyFields = requiredFields.filter(field => !this.Candidateformgroup.get(field)?.value);
  if (this.Candidateformgroup.valid && emptyFields.length === 0) {
  console.log(this.Candidateformgroup.value);
  if(this.Candidateformgroup.value.id != null && this.Candidateformgroup.value.id != "" ){
    this.cndservice.UpdateCandidate(this.Candidateformgroup.value).subscribe(response =>{
      console.log(response);
      this.getcandidatess(); 
    });
      this.Candidateformgroup.setValue({
        id: "",
        name: "",
        mobileNo: "",
        email: "",
        position: "",
        date: "",
        time: ""
      })
  }
  else{
    this.cndservice.CreateCandidate(this.Candidateformgroup.value).subscribe(response =>{
      console.log(response);
      this.getcandidatess(); 
      this.selectedTime = this.timeSlots[0];
    });
      this.Candidateformgroup.setValue({
        id: "",
        name: "",
        mobileNo: "",
        email: "",
        position: "",
        date: "",
        time: ""
      })
  }
} else {
  // Display validation errors if the form is invalid
  if (emptyFields.length > 0) {
    alert(`Please fill the following fields: ${emptyFields.join(', ')}`);
  } else {
    alert('Please enter a valid numerical value for Mobile no.');
  }
}
  
}

//filling form function
FillForm(cnd:Candidate){
  this.Candidateformgroup.setValue({
    id: cnd.id,
    name: cnd.name,
    mobileNo: cnd.mobileNo,
    email: cnd.email,
    position: cnd.position,
    date: cnd.date,
    time: cnd.time,
  })
}

//Removing details of a candidate function
DeleteCandidate(id:string){
  this.cndservice.DeleteCandidate(id).subscribe(response =>{
    console.log(response);
    this.getcandidatess(); 
    this.confirmDeleteModalVisible = false;
  });
}

//sorting(byname,bydate) function
sortCandidates() {
  const [field, order] = this.selectedSortMethod.split('-');

  if (field === 'name') {
    this.Candidateary.sort((a, b) => {
      const valueA = a.name.toLowerCase();
      const valueB = b.name.toLowerCase();
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  } else if (field === 'date') {
    this.Candidateary.sort((a, b) => {
      const valueA = new Date(a.date).getTime();
      const valueB = new Date(b.date).getTime();
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }
}

get totalPages(): number {
  return Math.ceil(this.Candidateary.length / this.pageSize);
}

// Create a computed property to get the candidates for the current page
get paginatedCandidates(): Candidate[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  return this.Candidateary.slice(startIndex, endIndex);
}

// Function to navigate to the previous page
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Function to navigate to the next page
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

confirmDeleteModalVisible = false;

selectedCandidateId: string = '';

//confirmdeletion
openConfirmDeleteModal(candidateId: string) {
  this.selectedCandidateId = candidateId;
  this.confirmDeleteModalVisible = true;
}

//timeslot
timeSlotModalVisible: boolean = false;
timeSlots: string[] = [];
populateTimeSlots() {
  const startTime = new Date();
  startTime.setHours(8, 0, 0); // Set start time to 8.00 AM

  const endTime = new Date();
  endTime.setHours(17, 0, 0); // Set end time to 5.00 PM

  const timeSlotDurationMinutes = 30; // Set the duration of each time slot in minutes

  const currentTime = new Date(startTime);
  while (currentTime <= endTime) {
    const timeString = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    this.timeSlots.push(timeString);

    currentTime.setTime(currentTime.getTime() + timeSlotDurationMinutes * 60000);
  }
}



openTimeSlotModal() {
 
  this.timeSlotModalVisible = true;
}

closeTimeSlotModal() {
  this.timeSlotModalVisible = false;
}

// selectTimeSlot(timeSlot: string) {
//   this.selectedTime = timeSlot;
//   this.Candidateformgroup.get('time')?.setValue(timeSlot); // Set the form control value with the selected time
//   this.closeTimeSlotModal();
// }
async selectTimeSlot(timeSlot: string) {
  const selectedDate = this.Candidateformgroup.get('date')?.value;

  try {
    // Check if the selected date exists in the database
    this.timeservice.getExistingData().subscribe((response: any) => {
      const existingData = response as any[];
      const matchingEntry = existingData.find(entry => entry.date === selectedDate && timeSlot.includes(entry.time));
      
      if (matchingEntry) {
        // Remove the matching time slot from the array
        const indexToRemove = this.timeSlots.indexOf(matchingEntry.time);
        if (indexToRemove !== -1) {
          this.timeSlots[indexToRemove] = ''; 
    
          // Rearrange the array by setting the selectedTime to the first available time
          this.selectedTime = this.timeSlots[0];
          this.Candidateformgroup.get('time')?.setValue(this.selectedTime);

         
        }
      } else {
        // If no matching entry, set the default time slot to the first available time
        this.selectedTime = this.timeSlots[0];
        this.Candidateformgroup.get('time')?.setValue(this.selectedTime);
      }
      
      this.closeTimeSlotModal();
    });
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    // Handle the error as needed (e.g., show an error message)
  }
}







//filter
filterModalVisible: boolean = false;
filterStartDate: string = '';
filterEndDate: string = '';
filteredCandidates: Candidate[] = []; // Array to store the filtered candidates
selectedPosition: string = '';

// Method to open the filter modal
openFilterModal() {
  this.filterModalVisible = true;
}

// Method to close the filter modal
closeFilterModal() {
  this.filterModalVisible = false;
}

// Method to apply the filter and update the table data
applyFilter() {
  if (this.filterStartDate && this.filterEndDate) {
    // Filter the candidates based on the selected start and end dates
    this.filteredCandidates = this.Candidateary.filter(candidate => {
      const candidateDate = new Date(candidate.date);
      const filterStartDate = new Date(this.filterStartDate);
      const filterEndDate = new Date(this.filterEndDate);

      return candidateDate >= filterStartDate && candidateDate <= filterEndDate;
    });
  } else {
    // If either start date or end date is not selected, clear the filtered candidates array
    this.filteredCandidates = this.Candidateary.slice();
  }
  if (this.selectedPosition) {
    this.filteredCandidates = this.filteredCandidates.filter(candidate => candidate.position === this.selectedPosition);
  }
  
  
  this.closeFilterModal();
}
resetFilter() {
  this.getcandidatess(); // Retrieve the original candidate data
}

}
