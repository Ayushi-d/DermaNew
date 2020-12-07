#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main () {
  string line;
  fstream myfile ("test.txt");

if (myfile.is_open())
  {
    while ( getline (myfile,line) )
    {
      cout<<line<<endl;
    }
  }

  else cout << "Unable to open file"<<endl; 

if (myfile.is_open())
  {
    myfile<<"1914344"<<endl;
    myfile<<"COE CSE 3Y"<<endl;
    myfile.close();

  }
  
  else cout<<"Unable to open file"<<endl;

  return 0;
}
