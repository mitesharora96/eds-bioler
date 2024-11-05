let currentPage = 1;
const itemsPerPage = 20;
let countryURL = ''

async function createList(page) {
    let  pathname = null;
    let offset = (page-1)* itemsPerPage;
    let jsonURL = countryURL;
    pathname= new URL(jsonURL);
    pathname = `${jsonURL}?offset=${offset}&limit=${itemsPerPage}`
    
    const resp = await fetch(pathname);
    const json = await resp.json();
    const list = document.createElement('ol');
    json.data.forEach((row,i) => {

        let conuntry=document.createElement("li");
        conuntry.innerText = row.Country
        list.appendChild(conuntry)
    });
    return list
}
function createPaginationControls(totalItems){
    const paginationDiv = document.createElement('div');
    paginationDiv.classList.add('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage); 

    // Create previous button
    const prevBtn = document.createElement('button');
    prevBtn.innerText = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    paginationDiv.append(prevBtn);

    for(let i=1; i<= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-number')
        pageButton.innerText = i;
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener('click', () => changePage(i));
    
        paginationDiv.append(pageButton);
      }

     // Create next button
     const nextBtn = document.createElement('button');
     nextBtn.innerText = "Next";
     nextBtn.disabled = currentPage === totalPages;
     nextBtn.addEventListener('click', () => changePage(currentPage + 1));
     paginationDiv.append(nextBtn);
     
     return paginationDiv;

}

async function changePage(newPage){
    const totalRows = await getTotalRowCount(countryURL);
    const totalPages = Math.ceil(totalRows / itemsPerPage);
  
    if (newPage < 1 || newPage > totalPages) 
        return; // Prevent going out of bounds

    currentPage = newPage;
    const table = document.querySelector(".contries-block table");
    table.innerHTML = "";
    const parentDiv = document.querySelector(".contries-block");
    
    parentDiv.innerHTML = ""; 
    parentDiv.append(await createList(currentPage));
    
    const paginationControls = createPaginationControls(totalRows);
    parentDiv.append(paginationControls);

    
}
async function getTotalRowCount(jsonURL) {
    const resp = await fetch(jsonURL);
    const json = await resp.json();
    return json.total || 0;
}

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv=document.createElement('div');
    parientDiv.classList.add('contries-block');
    countryURL = countries.href
    if (countries) {
        // parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createList(currentPage));
        const totalRows = await getTotalRowCount(countries.href); 
        const paginationControls = createPaginationControls(totalRows); 
        parientDiv.append(paginationControls);
        countries.replaceWith(parientDiv);
        
    }
    
  }
